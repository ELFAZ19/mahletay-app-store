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
    const [hoveredElement, setHoveredElement] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Initial fade-in sequence
        setTimeout(() => setLoaded(true), 100);

        const Engine = Matter.Engine,
              Render = Matter.Render,
              World = Matter.World,
              Bodies = Matter.Bodies,
              Runner = Matter.Runner,
              Mouse = Matter.Mouse,
              MouseConstraint = Matter.MouseConstraint,
              Events = Matter.Events,
              Vector = Matter.Vector;

        const engine = Engine.create();
        engine.world.gravity.y = 0; // Zero gravity
        engine.world.gravity.x = 0;
        engineRef.current = engine;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width,
                height,
                background: 'transparent',
                wireframes: false,
                showAngleIndicator: false,
                pixelRatio: window.devicePixelRatio
            }
        });
        renderRef.current = render;

        // Boundaries with softer bounce
        const wallOptions = { 
            isStatic: true, 
            render: { visible: false },
            friction: 0.05,
            restitution: 0.6 // Softer bounce
        };
        const walls = [
            Bodies.rectangle(width / 2, -60, width * 2, 120, wallOptions),
            Bodies.rectangle(width / 2, height + 60, width * 2, 120, wallOptions),
            Bodies.rectangle(width + 60, height / 2, 120, height * 2, wallOptions),
            Bodies.rectangle(-60, height / 2, 120, height * 2, wallOptions)
        ];
        World.add(engine.world, walls);

        const physicsEntities = [];
        
        const addBodyForElement = (domId, options = {}) => {
            const el = document.getElementById(domId);
            if (!el) return null;
            
            // Force a reflow to ensure CSS positioning is applied
            el.offsetHeight;
            
            const rect = el.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            const body = Bodies.rectangle(x, y, rect.width, rect.height, {
                restitution: 0.6,
                frictionAir: 0.015,
                friction: 0.05,
                density: options.density || 0.001,
                render: { visible: false },
                ...options
            });
            
            // Gentler initial velocity
            Matter.Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 1.5,
                y: (Math.random() - 0.5) * 1.5
            });

            // Very subtle rotation
            Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.01);

            World.add(engine.world, body);
            physicsEntities.push({ body, element: el, id: domId });
            elementsRef.current = physicsEntities;
            return body;
        };

        setTimeout(() => {
            addBodyForElement('hero-label', { density: 0.0015 });
            addBodyForElement('hero-title', { density: 0.004 });
            addBodyForElement('hero-desc', { density: 0.0018 });
            addBodyForElement('hero-btn-1', { density: 0.008 });
            addBodyForElement('hero-btn-2', { density: 0.008 });
            
            // Decorative floating particles
            for (let i = 0; i < 20; i++) {
                const size = Math.random() * 15 + 5;
                const circle = Bodies.circle(
                    Math.random() * width,
                    Math.random() * height,
                    size,
                    {
                        restitution: 0.9,
                        frictionAir: 0.003,
                        density: 0.0005,
                        render: {
                            fillStyle: `rgba(212, 175, 55, ${Math.random() * 0.4 + 0.1})`,
                            strokeStyle: 'transparent'
                        }
                    }
                );
                Matter.Body.setVelocity(circle, {
                    x: (Math.random() - 0.5) * 0.8,
                    y: (Math.random() - 0.5) * 0.8
                });
                World.add(engine.world, circle);
            }
        }, 150);

        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.15,
                damping: 0.1,
                render: { visible: false }
            }
        });
        World.add(engine.world, mouseConstraint);

        // Enhanced interaction with hover detection
        Events.on(engine, 'beforeUpdate', () => {
            const mousePosition = mouse.position;
            
            physicsEntities.forEach(({ body, element, id }) => {
                const d = Vector.dist(mousePosition, body.position);
                
                // Repel effect (stronger when not dragging)
                if (mouseConstraint.body !== body && d < 250) {
                    const force = Vector.sub(body.position, mousePosition);
                    Vector.normalise(force);
                    const strength = (250 - d) / 15000;
                    Matter.Body.applyForce(body, body.position, Vector.mult(force, strength));
                    
                    // Trigger hover state when very close
                    if (d < 150 && id) {
                        setHoveredElement(id);
                    }
                } else if (hoveredElement === id && d >= 150) {
                    setHoveredElement(null);
                }

                // Add subtle velocity to keep things moving
                if (body.velocity.x < 0.1 && body.velocity.y < 0.1) {
                    Matter.Body.setVelocity(body, {
                        x: body.velocity.x + (Math.random() - 0.5) * 0.1,
                        y: body.velocity.y + (Math.random() - 0.5) * 0.1
                    });
                }
            });
        });

        Events.on(render, 'afterRender', () => {
            physicsEntities.forEach(({ body, element }) => {
                const { x, y } = body.position;
                const angle = body.angle;
                
                element.style.transform = `translate(${x - element.offsetWidth/2}px, ${y - element.offsetHeight/2}px) rotate(${angle}rad)`;
            });
        });

        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);
        runnerRef.current = runner;

        return () => {
            Render.stop(render);
            Runner.stop(runner);
            World.clear(engine.world);
            Engine.clear(engine);
            if (render.canvas) {
                render.canvas.remove();
                render.canvas = null;
                render.context = null;
                render.textures = {};
            }
        };
    }, []);

    return (
        <div className="gravity-hero-container" ref={sceneRef}>
            <div 
                id="hero-label" 
                className={`gravity-element label-element ${loaded ? 'loaded' : ''} ${hoveredElement === 'hero-label' ? 'hovered' : ''}`}
            >
                <span className="sacred-badge">✝ Sacred Hymns</span>
            </div>

            <div 
                id="hero-title" 
                className={`gravity-element title-element ${loaded ? 'loaded' : ''} ${hoveredElement === 'hero-title' ? 'hovered' : ''}`}
            >
                <h1>Ethiopian <br/><span className="text-gold">Orthodox</span></h1>
            </div>

            <div 
                id="hero-desc" 
                className={`gravity-element desc-element ${loaded ? 'loaded' : ''} ${hoveredElement === 'hero-desc' ? 'hovered' : ''}`}
            >
                <p>Experience the divine beauty of traditional hymns.</p>
            </div>

            <div 
                id="hero-btn-1" 
                className={`gravity-element btn-element ${loaded ? 'loaded' : ''} ${hoveredElement === 'hero-btn-1' ? 'hovered' : ''}`}
            >
                <Link to="/download">
                    <Button size="large" variant="primary">
                        <FiDownload /> Download App
                    </Button>
                </Link>
            </div>

            <div 
                id="hero-btn-2" 
                className={`gravity-element btn-element ${loaded ? 'loaded' : ''} ${hoveredElement === 'hero-btn-2' ? 'hovered' : ''}`}
            >
                <Link to="/about">
                    <Button size="large" variant="outline">
                        Learn More
                    </Button>
                </Link>
            </div>
            
            <div className={`instruction-hint ${loaded ? 'visible' : ''}`}>
                Drag elements to throw • Hover to repel
            </div>
        </div>
    );
};

export default GravityHero;
