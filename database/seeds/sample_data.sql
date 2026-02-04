-- Seed Data for Orthodox Hymn Platform
-- Run this after schema.sql

USE mahletay_app_store;

-- =====================================================
-- Seed Users (Admin Account)
-- Default password: Admin@123 (hashed with bcrypt)
-- =====================================================
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@orthodoxhymn.com', '$2a$12$.BTfDN9DvTNAbpRx63m6xeRXaKltBRI.90phZkR9TyqakLli.rium', 'admin'),
('moderator', 'moderator@orthodoxhymn.com', '$2a$12$.BTfDN9DvTNAbpRx63m6xeRXaKltBRI.90phZkR9TyqakLli.rium', 'moderator');

-- =====================================================
-- Seed App Versions
-- =====================================================
INSERT INTO app_versions (version_number, version_name, changelog, file_path, file_size, release_date, is_active) VALUES
('1.0.0', 'Initial Release', '• First public release\n• 100+ traditional Ethiopian Orthodox hymns\n• Amharic and Ge\'ez language support\n• Offline audio playback\n• Beautiful sacred UI design', '/uploads/apk/sample-v1.0.0.apk', 25600000, '2024-01-15', true),
('1.1.0', 'Enhanced Features', '• Added 50 more hymns\n• Improved search functionality\n• Dark mode support\n• Bug fixes and performance improvements\n• Added hymn categories', '/uploads/apk/sample-v1.1.0.apk', 28700000, '2024-06-20', true),
('1.2.0', 'Latest Version', '• 200+ hymns now available\n• New user interface with sacred aesthetics\n• Daily devotional notifications\n• Hymn lyrics in multiple languages\n• Performance optimization\n• Enhanced audio quality', '/uploads/apk/sample-v1.2.0.apk', 31200000, '2024-12-01', true);

-- =====================================================
-- Seed Reviews
-- =====================================================
INSERT INTO reviews (version_id, reviewer_name, review_text, is_approved, is_featured, created_at) VALUES
(1, 'Daniel Tesfaye', 'This app is a blessing! It helps me connect with my faith during my daily prayers. The hymns are beautifully curated and the quality is excellent.', true, true, '2024-01-20 10:30:00'),
(1, 'Sara Bekele', 'Thank you for creating this wonderful application. The traditional hymns remind me of church services. Very peaceful and spiritual.', true, true, '2024-01-25 14:15:00'),
(2, 'Michael Haile', 'The dark mode in version 1.1.0 is perfect for evening prayers. The app runs smoothly and the search feature makes it easy to find specific hymns.', true, false, '2024-06-25 08:45:00'),
(2, 'Ruth Alem', 'God bless the developers! This app has become part of my daily spiritual routine. The new categories make navigation so much easier.', true, true, '2024-07-02 16:20:00'),
(3, 'Abraham Desta', 'Version 1.2.0 is amazing! 200 hymns is incredible. The daily devotional notifications are helping me maintain consistency in my prayer life.', true, true, '2024-12-10 12:00:00'),
(3, 'Hanna Mekonnen', 'Beautiful sacred design that truly honors our Orthodox tradition. The lyrics in multiple languages help me understand the deeper meaning. Highly recommended!', true, false, '2024-12-15 09:30:00'),
(3, 'Yonas Girma', 'This is exactly what I was looking for. The audio quality is superb and the offline feature means I can listen anywhere. May God bless you!', true, false, '2024-12-18 18:45:00'),
(1, 'Helen Solomon', 'Awaiting approval - new review', false, false, NOW());

-- =====================================================
-- Seed Ratings
-- =====================================================
INSERT INTO ratings (version_id, rating, ip_address) VALUES
(1, 5, '192.168.1.100'),
(1, 5, '192.168.1.101'),
(1, 4, '192.168.1.102'),
(1, 5, '192.168.1.103'),
(2, 5, '192.168.1.104'),
(2, 4, '192.168.1.105'),
(2, 5, '192.168.1.106'),
(2, 5, '192.168.1.107'),
(2, 4, '192.168.1.108'),
(3, 5, '192.168.1.109'),
(3, 5, '192.168.1.110'),
(3, 5, '192.168.1.111'),
(3, 4, '192.168.1.112'),
(3, 5, '192.168.1.113'),
(3, 5, '192.168.1.114');

-- =====================================================
-- Seed Downloads
-- =====================================================
INSERT INTO downloads (version_id, ip_address, user_agent, downloaded_at) VALUES
(1, '192.168.1.100', 'Mozilla/5.0 (Android)', '2024-01-16 10:00:00'),
(1, '192.168.1.101', 'Mozilla/5.0 (Android)', '2024-01-17 14:30:00'),
(1, '192.168.1.102', 'Mozilla/5.0 (Android)', '2024-01-18 09:15:00'),
(2, '192.168.1.103', 'Mozilla/5.0 (Android)', '2024-06-21 11:00:00'),
(2, '192.168.1.104', 'Mozilla/5.0 (Android)', '2024-06-22 15:45:00'),
(2, '192.168.1.105', 'Mozilla/5.0 (Android)', '2024-06-23 13:20:00'),
(3, '192.168.1.106', 'Mozilla/5.0 (Android)', '2024-12-02 08:30:00'),
(3, '192.168.1.107', 'Mozilla/5.0 (Android)', '2024-12-03 16:10:00'),
(3, '192.168.1.108', 'Mozilla/5.0 (Android)', '2024-12-04 10:50:00'),
(3, '192.168.1.109', 'Mozilla/5.0 (Android)', '2024-12-05 14:00:00');

-- =====================================================
-- Seed Feedback
-- =====================================================
INSERT INTO feedback (type, name, email, message, status, created_at) VALUES
('blessing', 'Kidus Yohannes', 'kidus@email.com', 'May God continue to bless your work! This app has brought me closer to my faith. Thank you for your dedication to spreading Orthodox hymns.', 'reviewed', '2024-02-01 10:00:00'),
('suggestion', 'Marta Kebede', 'marta@email.com', 'Would it be possible to add a feature to create custom playlists? It would help organize hymns for different prayer times throughout the day.', 'pending', '2024-03-15 14:30:00'),
('bug', 'Dawit Alemu', 'dawit@email.com', 'Sometimes the audio playback stops unexpectedly when I minimize the app. This happens on my Samsung Galaxy S10.', 'resolved', '2024-05-20 09:45:00'),
('suggestion', 'Bethlehem Tadesse', 'bethlehem@email.com', 'The app is wonderful! Could you please add hymns with English translations for those of us still learning Amharic? God bless you!', 'reviewed', '2024-08-10 16:20:00'),
('blessing', 'Abune Marcus', 'father.marcus@church.et', 'As a priest, I recommend this app to my congregation. It is a beautiful resource for maintaining spiritual connection outside of church. Keep up the blessed work!', 'reviewed', '2024-09-05 11:00:00');

-- =====================================================
-- Update feedback with admin responses
-- =====================================================
UPDATE feedback 
SET admin_response = 'Thank you for your blessing! We are humbled to serve the Orthodox community and grateful that the app is helping your spiritual journey. Please keep us in your prayers.',
    responded_by = 1,
    status = 'reviewed',
    responded_at = '2024-02-02 09:00:00'
WHERE id = 1;

UPDATE feedback 
SET admin_response = 'Thank you for the excellent suggestion! Custom playlists are now on our roadmap for version 1.3.0. We appreciate your feedback!',
    responded_by = 1,
    status = 'reviewed',
    responded_at = '2024-03-16 10:30:00'
WHERE id = 2;

UPDATE feedback 
SET admin_response = 'Thank you for reporting this bug. We have identified and fixed the background playback issue in version 1.1.0. Please update to the latest version.',
    responded_by = 2,
    status = 'resolved',
    responded_at = '2024-05-22 08:15:00'
WHERE id = 3;

UPDATE feedback 
SET admin_response = 'Excellent suggestion! We are working on adding English translations for many hymns. This will be available in an upcoming release. God bless!',
    responded_by = 1,
    status = 'reviewed',
    responded_at = '2024-08-12 14:00:00'
WHERE id = 4;

UPDATE feedback 
SET admin_response = 'We are deeply honored by your blessing, Father. Knowing that the app serves the spiritual needs of our church community is our greatest joy. May God continue to guide our work.',
    responded_by = 1,
    status = 'reviewed',
    responded_at = '2024-09-06 09:30:00'
WHERE id = 5;

-- =====================================================
-- Confirmation Message
-- =====================================================
SELECT 'Database seeded successfully!' as message;
SELECT CONCAT('Users: ', COUNT(*)) as count FROM users;
SELECT CONCAT('Versions: ', COUNT(*)) as count FROM app_versions;
SELECT CONCAT('Reviews: ', COUNT(*)) as count FROM reviews;
SELECT CONCAT('Ratings: ', COUNT(*)) as count FROM ratings;
SELECT CONCAT('Downloads: ', COUNT(*)) as count FROM downloads;
SELECT CONCAT('Feedback: ', COUNT(*)) as count FROM feedback;
