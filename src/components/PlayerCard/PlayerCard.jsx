import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PlayerCard.css';
import axios from 'axios'; 

const PlayerCard = () => {
    const { playerId } = useParams();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/user/${playerId}`);
                setPlayer(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchPlayer();
    }, [playerId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className='mainPlayerCard'>
            <div className='mainPlayerCard2'></div>
            <div className='profilePlayer'>
                <div className='name'>
                    <h2>{player.firstName} {player.lastName}</h2>
                </div>
                <div className="stats">
                    <div className="stat-item">
                        <div className="value">{player.profile.games}</div>
                        <div className="label">Игры</div>
                    </div>
                    <div className="stat-item">
                        <div className="value">{player.profile.goals}</div>
                        <div className="label">Забитые голы</div>
                    </div>
                </div>
            </div>
            <div className='era'>
                <div className="button-container">
                    <div className="button play">
                        <div className="triangle right"></div>
                    </div>
                    <div className="button pause">
                        <div className="triangle left"></div>
                    </div>
                </div>
                <div className='playerPhoto'>
                    <img src={player.profile.profilePhoto || "default_photo_url"} alt={`${player.firstName} ${player.lastName}`} />
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
