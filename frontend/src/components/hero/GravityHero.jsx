import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Link } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';
import Button from '../common/Button';
import './GravityHero.css';

const GravityHero = () => {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const renderRef = useRef(null);
    const runnerRef = useRef(null);
    const elementsRef = useRef([]);

    // We'll track the dimensions to resizing
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // 1. Setup Matter.js Engine
        const Engine = Matter.Engine,
              Render = Matter.Render,
              World = Matter.World,
              Bodies = Matter.Bodies,
              Runner = Matter.Runner,
              Mouse = Matter.Mouse,
              MouseConstraint = Matter.MouseConstraint,
              Composite = Matter.Composite,
              Events = Matter.Events,
              Vector = Matter.Vector;

        const engine = Engine.create();
        engine.world.gravity.y = 0; // Zero gravity
        engine.world.gravity.x = 0;
        engineRef.current = engine;

        // 2. Setup Render (optional, mostly for debugging or background particles)
        // We will overlay DOM elements, so the render canvas is for reference or decorative shapes
        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width,
                height,
                background: 'transparent',
                wireframes: false,
                showAngleIndicator: false
            }
        });
        renderRef.current = render;

        // 3. Create Boundaries (Walls)
        const wallOptions = { 
            isStatic: true, 
            render: { visible: false },
            friction: 0.1,
            restitution: 0.8 
        };
        const walls = [
            Bodies.rectangle(width / 2, -50, width * 2, 100, wallOptions), // Top
            Bodies.rectangle(width / 2, height + 50, width * 2, 100, wallOptions), // Bottom
            Bodies.rectangle(width + 50, height / 2, 100, height * 2, wallOptions), // Right
            Bodies.rectangle(-50, height / 2, 100, height * 2, wallOptions) // Left
        ];
        World.add(engine.world, walls);

        // 4. Create Bodies for DOM Elements
        // We need to wait for DOM elements to be rendered to measure them
        // For now, we define them abstractly and sync them in the animation loop
        const physicsEntities = [];
        
        // Helper to add body
        const addBodyForElement = (domId, options = {}) => {
            const el = document.getElementById(domId);
            if (!el) return null;
            
            const rect = el.getBoundingClientRect();
            // Matter.js positions are center-based, DOM is top-left
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            const body = Bodies.rectangle(x, y, rect.width, rect.height, {
                restitution: 0.8, // Bouncy
                frictionAir: 0.02, // Air resistance
                friction: 0.1,
                density: options.density || 0.001,
                render: { visible: false }, // We render via DOM
                ...options
            });
            
            // Random initial velocity for drift
            Matter.Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            });

            // Random rotation
            Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.02);

            World.add(engine.world, body);
            physicsEntities.push({ body, element: el });
            return body;
        };

        // Add main elements
        // Note: We need to give the browser a moment to layout the CSS before measuring
        setTimeout(() => {
            addBodyForElement('hero-label', { density: 0.002 });
            addBodyForElement('hero-title', { density: 0.005 });
            addBodyForElement('hero-desc', { density: 0.002 });
            addBodyForElement('hero-btn-1', { density: 0.01 });
            addBodyForElement('hero-btn-2', { density: 0.01 });
            
            // Add decorative circles (pure canvas physics objects)
            for (let i = 0; i < 15; i++) {
                const circle = Bodies.circle(
                    Math.random() * width,
                    Math.random() * height,
                    Math.random() * 20 + 5,
                    {
                        restitution: 0.9,
                        frictionAir: 0.005,
                        render: {
                            fillStyle: Math.random() > 0.5 ? '#D4AF37' : '#E8CC6D',
                            opacity: Math.random() * 0.5 + 0.1
                        }
                    }
                );
                World.add(engine.world, circle);
            }
        }, 100);

        // 5. Mouse Control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        World.add(engine.world, mouseConstraint);

        // Allow scrolling over the canvas (set css pointer-events: none on canvas usually, but we need drag)
        // We'll manage this via CSS 

        // 6. Interaction Loop (Repel & Sync)
        Events.on(engine, 'beforeUpdate', () => {
            const mousePosition = mouse.position;
            
            physicsEntities.forEach(({ body }) => {
                // Repel effect when mouse is close (but not dragging)
                if (mouseConstraint.body !== body) {
                    const d = Vector.dist(mousePosition, body.position);
                    if (d < 200) {
                        const force = Vector.sub(body.position, mousePosition);
                        Vector.normalise(force);
                        const strength = (200 - d) / 20000;
                        Matter.Body.applyForce(body, body.position, Vector.mult(force, strength));
                    }
                }

                // Keep bodies within bounds gently (soft bounce back if they tunnel)
                // (Walls handle mostly, but this is a fail-safe)
            });
        });

        Events.on(render, 'afterRender', () => {
            physicsEntities.forEach(({ body, element }) => {
                // Sync DOM position with Physics Body
                const { x, y } = body.position;
                const angle = body.angle;
                
                element.style.transform = `translate(${x - element.offsetWidth/2}px, ${y - element.offsetHeight/2}px) rotate(${angle}rad)`;
            });
        });

        // 7. Run
        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);
        runnerRef.current = runner;

        // Cleanup
        return () => {
            Render.stop(render);
            Runner.stop(runner);
            World.clear(engine.world);
            Engine.clear(engine);
            render.canvas.remove();
            render.canvas = null;
            render.context = null;
            render.textures = {};
        };
    }, []);

    return (
        <div className="gravity-hero-container" ref={sceneRef}>
            {/* 
               We place elements absolutely. They are hidden initially or centered
               The physics engine will take over their transform immediately after mount
            */}
            
            <div id="hero-label" className="gravity-element label-element">
                <span className="sacred-badge">✝ Sacred Hymns</span>
            </div>

            <div id="hero-title" className="gravity-element title-element">
                <h1>Ethiopian <br/><span className="text-gold">Orthodox</span></h1>
            </div>

            <div id="hero-desc" className="gravity-element desc-element">
                <p>Experience the divine beauty of traditional hymns.</p>
            </div>

            <div id="hero-btn-1" className="gravity-element btn-element">
                <Link to="/download">
                    <Button size="large" variant="primary">
                        <FiDownload /> Download App
                    </Button>
                </Link>
            </div>

            <div id="hero-btn-2" className="gravity-element btn-element">
                <Link to="/about">
                    <Button size="large" variant="outline">
                        Learn More
                    </Button>
                </Link>
            </div>
            
            <div className="instruction-hint">
                Drag elements to throw • Hover to repel
            </div>
        </div>
    );
};

export default GravityHero;
