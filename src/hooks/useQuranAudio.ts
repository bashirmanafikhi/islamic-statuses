import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useEffect, useState } from 'react';

export interface AyaIdentifier {
    surah_number: number;
    ayah_number: number;
}

const getAudioUrl = (surah_number: number, ayah_number: number) =>
    `https://everyayah.com/data/Alafasy_128kbps/${surah_number
        .toString()
        .padStart(3, '0')}${ayah_number.toString().padStart(3, '0')}.mp3`;

export const useQuranAudio = () => {
    const [playingKey, setPlayingKey] = useState<string | null>(null);
    const player = useAudioPlayer();
    const status = useAudioPlayerStatus(player);

    const ayaKey = (sura: number, aya: number) => `${sura}-${aya}`;

    const onPlayPause = useCallback(
        async (item: AyaIdentifier) => {
            const key = ayaKey(item.surah_number, item.ayah_number);
            const isCurrentlyPlaying = playingKey === key;

            try {
                // Toggle pause/resume if same aya
                if (isCurrentlyPlaying) {
                    if (status.playing) {
                        await player.pause();
                        // setPlayingKey(null); // reset key on manual pause - User commented this out or kept it? User snippet says reset on manual pause.
                    } else {
                        await player.play();
                    }
                    return;
                }

                // Stop any other playing aya if needed (replace already handles loading new source)
                // Load new aya and play
                await player.replace(getAudioUrl(item.surah_number, item.ayah_number));
                await player.play();
                setPlayingKey(key);

            } catch (err) {
                console.error("Audio playback error:", err);
                setPlayingKey(null);
            }
        },
        [playingKey, player, status.playing]
    );

    useEffect(() => {
        if (status.didJustFinish) {
            setPlayingKey(null);
        }
    }, [status.didJustFinish]);

    return { playingKey, onPlayPause, ayaKey, status };
};
