import { SOUND_FREQUENCIES } from '../constants';

// Sound effects helper functions
export const playSound = (frequency: number, duration: number, type: 'sine' | 'square' | 'sawtooth' = 'sine') => {
  if (typeof window !== 'undefined' && window.AudioContext) {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  }
};

// Specific sound effects
export const playSelectSound = () => playSound(SOUND_FREQUENCIES.SELECT, 0.1);
export const playSwapSound = () => playSound(SOUND_FREQUENCIES.SWAP, 0.2);
export const playMatchSound = () => playSound(SOUND_FREQUENCIES.MATCH, 0.3);
export const playDropSound = () => playSound(SOUND_FREQUENCIES.DROP, 0.15);
export const playWinSound = () => playSound(SOUND_FREQUENCIES.WIN, 0.5);
export const playLoseSound = () => playSound(SOUND_FREQUENCIES.LOSE, 1);

// Haptic feedback
export const vibrate = (pattern: number | number[]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};
