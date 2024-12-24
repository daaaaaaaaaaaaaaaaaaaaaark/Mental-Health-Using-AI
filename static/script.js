document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    let selectedMood = null;

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.dataset.section;
            
            // Update active states
            navButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });

    // Mood Tracking
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodNote = document.getElementById('mood-note');
    const saveMoodBtn = document.getElementById('save-mood');
    const moodHistory = document.getElementById('mood-history');

    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            moodButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedMood = btn.dataset.mood;
        });
    });

    saveMoodBtn.addEventListener('click', async () => {
        if (!selectedMood) {
            alert('Please select a mood');
            return;
        }

        try {
            saveMoodBtn.disabled = true;
            const response = await fetch('/api/mood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mood: selectedMood,
                    note: moodNote.value,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save mood');
            }

            const result = await response.json();
            if (result.success) {
                // Clear form
                selectedMood = null;
                moodNote.value = '';
                moodButtons.forEach(b => b.classList.remove('selected'));
                
                // Update history
                await updateMoodHistory();
            }
        } catch (error) {
            console.error('Error saving mood:', error);
            alert('Failed to save your mood. Please try again.');
        } finally {
            saveMoodBtn.disabled = false;
        }
    });

    // Chat functionality
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message');
    let isProcessing = false;

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message || isProcessing) return;

        try {
            isProcessing = true;
            sendMessageBtn.disabled = true;
            chatInput.disabled = true;

            // Add user message to chat
            addMessageToChat('user', message);
            
            // Show typing indicator
            const typingIndicator = addMessageToChat('ai', '...', 'typing');
            
            // Clear input
            chatInput.value = '';

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message,
                    mood: selectedMood
                })
            });

            // Remove typing indicator
            typingIndicator.remove();

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get AI response');
            }

            const result = await response.json();
            if (result.success) {
                addMessageToChat('ai', result.response);
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
            addMessageToChat('ai', 'I apologize, but I encountered an error. Please try again.');
        } finally {
            isProcessing = false;
            sendMessageBtn.disabled = false;
            chatInput.disabled = false;
            chatInput.focus();
        }
    }

    function addMessageToChat(type, content, className = '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message ${className}`;
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    }

    sendMessageBtn.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Initial welcome message
    addMessageToChat('ai', 'Hello! I\'m your Mindful AI companion. How are you feeling today? I\'m here to listen and support you.');

    async function updateMoodHistory() {
        try {
            const response = await fetch('/api/moods');
            if (!response.ok) {
                throw new Error('Failed to fetch mood history');
            }

            const moods = await response.json();
            moodHistory.innerHTML = moods.map(entry => `
                <div class="mood-entry">
                    <div class="mood-emoji">
                        ${getMoodEmoji(entry.mood)}
                    </div>
                    <div class="mood-details">
                        <div class="mood-timestamp">
                            ${new Date(entry.timestamp).toLocaleString()}
                        </div>
                        ${entry.note ? `<div class="mood-note">${entry.note}</div>` : ''}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching mood history:', error);
            moodHistory.innerHTML = '<p class="error">Failed to load mood history</p>';
        }
    }

    function getMoodEmoji(mood) {
        const emojis = {
            happy: '😊',
            calm: '😌',
            sad: '😢',
            anxious: '😰',
            angry: '😠'
        };
        return emojis[mood] || '❓';
    }

    // Initial load of mood history
    updateMoodHistory();

    // Meditation Timer
    const breathingCircle = document.querySelector('.breathing-circle');
    const meditationStartBtn = document.querySelector('#meditation .primary-btn');
    let isBreathingExerciseActive = false;

    meditationStartBtn.addEventListener('click', () => {
        isBreathingExerciseActive = !isBreathingExerciseActive;
        
        if (isBreathingExerciseActive) {
            breathingCircle.style.animation = 'breathing 4s ease-in-out infinite';
            meditationStartBtn.textContent = 'Stop';
        } else {
            breathingCircle.style.animation = 'none';
            meditationStartBtn.textContent = 'Start';
        }
    });

    // Inspiration Section Functionality
    const quoteText = document.querySelector('.quote-text');
    const quoteAuthor = document.querySelector('.quote-author');
    const newQuoteBtn = document.getElementById('new-quote');
    const songsList = document.querySelector('.songs-list');
    const songFilters = document.querySelectorAll('.filter-btn');
    const storyTitle = document.querySelector('.story-title');
    const storyText = document.querySelector('.story-text');
    const newStoryBtn = document.getElementById('new-story');
    const storyCategories = document.querySelectorAll('.category-btn');

    let currentCategory = 'inspiration';

    // Quotes functionality
    function displayRandomQuote() {
        const quotes = window.inspirationalData.quotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteText.textContent = `"${randomQuote.text}"`;
        quoteAuthor.textContent = `- ${randomQuote.author}`;
        
        // Add fade-in animation
        quoteText.style.opacity = 0;
        quoteAuthor.style.opacity = 0;
        setTimeout(() => {
            quoteText.style.opacity = 1;
            quoteAuthor.style.opacity = 1;
        }, 50);
    }

    newQuoteBtn?.addEventListener('click', displayRandomQuote);

    // Songs functionality
    function displaySongs(mood = 'all') {
        if (!songsList) return;
        
        songsList.innerHTML = '';
        const songs = window.inspirationalData.songs;
        
        let filteredSongs = [];
        if (mood === 'all') {
            Object.values(songs).forEach(moodSongs => {
                filteredSongs = [...filteredSongs, ...moodSongs];
            });
        } else {
            filteredSongs = songs[mood] || [];
        }

        filteredSongs.forEach(song => {
            const songElement = document.createElement('div');
            songElement.className = 'song-item';
            songElement.innerHTML = `
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                    <div class="song-description">${song.description}</div>
                </div>
            `;
            songsList.appendChild(songElement);
        });
    }

    songFilters?.forEach(filter => {
        filter.addEventListener('click', () => {
            songFilters.forEach(btn => btn.classList.remove('active'));
            filter.classList.add('active');
            displaySongs(filter.dataset.mood);
        });
    });

    // Stories functionality
    function displayRandomStory(category = currentCategory) {
        if (!storyTitle || !storyText) return;

        const stories = window.inspirationalData.stories[category];
        const randomStory = stories[Math.floor(Math.random() * stories.length)];
        
        // Add fade-out effect
        storyTitle.style.opacity = 0;
        storyText.style.opacity = 0;
        
        setTimeout(() => {
            storyTitle.textContent = randomStory.title;
            storyText.textContent = randomStory.text;
            
            // Add fade-in effect
            storyTitle.style.opacity = 1;
            storyText.style.opacity = 1;
        }, 300);
    }

    storyCategories?.forEach(category => {
        category.addEventListener('click', () => {
            storyCategories.forEach(btn => btn.classList.remove('active'));
            category.classList.add('active');
            currentCategory = category.dataset.category;
            displayRandomStory(currentCategory);
        });
    });

    newStoryBtn?.addEventListener('click', () => displayRandomStory(currentCategory));

    // Initialize inspiration section
    if (document.getElementById('inspire')) {
        displayRandomQuote();
        displaySongs('all');
        displayRandomStory('inspiration');
    }
});
