import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axiosService';
import { useNavigate } from 'react-router-dom';
import './RoomDetail.css';

function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [teams, setTeams] = useState([]);
  const [view, setView] = useState('players'); // 'info', 'players', 'teams'
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [captains, setCaptains] = useState({});
  const [isCaptain, setIsCaptain] = useState(false);
  const [teamPlayers, setTeamPlayers] = useState([]); // Состояние для команды
  const [teamData, setTeamData] = useState({
    roomId:id,
    teamName:'',
    maxPlayers:6
  })
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axiosInstance.get(`/roomss/${id}`);
        setRoom(response.data);
        const localUser = localStorage.getItem('userId');
        if (response.data.admin_id._id === localUser) {
          setIsAdmin(true);
        }
        setIsClosed(response.data.isClosed);

        if (response.data.name) {
          const response2 = await axiosInstance.get(`/tournaments/name/${response.data.name}/participants`);
          setPlayers(response2.data.participants);

          const userDetailsTemp = {};
          const captainsTemp = {};

          await Promise.all(
            response2.data.participants.map(async (participant) => {
              try {
                const response3 = await axiosInstance.get(`/user/${participant.userId._id}`);
                userDetailsTemp[participant.userId._id] = response3.data;
                captainsTemp[participant.userId._id] = participant.isCaptain;
                if (participant.userId._id === localUser && participant.isCaptain) {
                  setIsCaptain(true);
                }
              } catch (error) {
                console.error('Ошибка при получении данных пользователя', error);
              }
            })
          );

          setUserDetails(userDetailsTemp);
          setCaptains(captainsTemp);
        }
        const response2 = await axiosInstance.get(`/getAllTeamsInRoom/${id}`);
        setTeams(response2.data);
      } catch (error) {
        console.error('Ошибка при получении данных турнира', error);
      }
    };

    fetchRoom();
  }, [id]);

  // useEffect(() => {
  //   console.log('SDA', teamId1);
  // }, [teamId1]); // Этот эффект будет выполняться при каждом изменении teamId1


  useEffect(() =>{})
 

const fetchPlayers = async () => {
  try {
    if (room && room.name) {
      const response = await axiosInstance.get(`/tournaments/name/${room.name}/participants`);
      setPlayers(response.data.participants);
      const userDetailsTemp = {};
      const captainsTemp = {};
      const localUser = localStorage.getItem('userId')
      await Promise.all(
        response.data.participants.map(async (participant) => {
          try {
            const response2 = await axiosInstance.get(`/user/${participant.userId._id}`);
            userDetailsTemp[participant.userId._id] = response2.data;
            captainsTemp[participant.userId._id] = participant.isCaptain;
            if(participant.userId._id === localUser && participant.isCaptain){
              setIsCaptain(true);
            }
          } catch (error) {
            console.error('Ошибка при получении данных пользователя', error);
          }
        })
      );
      setUserDetails(userDetailsTemp);
      setCaptains(captainsTemp);
    }
  } catch (error) {
    console.error('Ошибка при получении данных участников', error);
  }
};

  const fetchTeams = async () => {
    try {
      const response = await axiosInstance.get(`/getAllTeamsInRoom/${id}`);
      setTeams(response.data);
      // console.log('hellllo',teams._id)
      // setTeamId(teams._id)
    } catch (error) {
      console.error('Ошибка при получении данных команд', error);
    }
  };

  const handleViewChange = (newView) => {
    const localUser = localStorage.getItem('userId');
    console.log(localUser);
    setView(newView);
    if (newView === 'players') {
      fetchPlayers();
    } else if (newView === 'teams') {
      fetchTeams();
    }
  };

  const toggleRegistrationStatus = async () => {
    const token = localStorage.getItem('token'); // Предположим, что токен хранится в localStorage
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      if (isClosed) {
        await axiosInstance.post(`/open-room/${id}`, {}, config);
        setIsClosed(false);
      } else {
        await axiosInstance.post(`/close-room/${id}`, {}, config);
        setIsClosed(true);
      }
    } catch (error) {
      console.error('Ошибка при изменении статуса регистрации', error);
    }
  };

  const handleJoin = () => {
    navigate('/formJoin');
  };

  const handlePlayerClick = (playerId) => {
    navigate(`/player-card/${playerId}`);
  };

  const assignCaptain = async (userId) => {
    const roomId = id;
    try {
      const response = await axiosInstance.post('/assigncaptain', {
        roomId,
        userId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCaptains(prev => ({ ...prev, [userId]: true }));
      console.log(response.data.message);
    } catch (err) {
      console.error('Ошибка при назначении капитана', err.response.data);
    }
  };

  const removeCaptain = async (userId) => {
    const roomId = id;
    try {
      const response = await axiosInstance.post('/assigncaptainRemove', {
        roomId,
        userId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCaptains(prev => ({ ...prev, [userId]: false }));
      console.log(response.data.message);
    } catch (err) {
      console.error('Ошибка при удалении капитана', err.response.data);
    }
  };


  
  const handleChangePlayerName = async(e) => {
    setTeamData({...teamData, [e.target.name]: e.target.value});
  }
  
  const createTeam = async (e) => {
    e.preventDefault(); // Предотвращает стандартное поведение формы
    console.log(teamData.teamName);

    if (room.formatPlay === '5x5') {
      teamData.maxPlayers = 5;
    } else {
      teamData.maxPlayers = 6;
    }
    console.log(teamData.maxPlayers);
    console.log(teamData.roomId);
    try {
      const response = await axiosInstance.post(
        '/create-team',
        {
          roomId: teamData.roomId,
          teamName: teamData.teamName,
          maxPlayers: teamData.maxPlayers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log(response.data);
      console.log('kk', response.data.team._id);
      // setTeamId(response.data.team._id);
    } catch (err) {
      console.error('Ошибка при создании команды', err.response.data);
    }
  };

  if (!room) {
    return <div>Загрузка...</div>;
  }


  const addPlayerToTeam = async (teamId1,participantId) => {
    console.log('teamId:',teamId1)
    console.log('IdPar',participantId)
    try {
       const response = await axiosInstance.post('/add-player', {
        teamId1,// Убедитесь, что вы передаете правильный идентификатор команды,
        participantId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setTeamPlayers(response.data.team.players);
      console.log('Игрок успешно добавлен в команду');
    } catch (error) {
      console.error('Ошибка при добавлении игрока в команду', error.response.data);
    }
  };


  return (
    <div className="era">
      <div className="era8">
        <div className="era9">
          <div className="era10">{room.name}</div>
          {isAdmin ? (
            <button onClick={toggleRegistrationStatus}>
              {isClosed ? 'Открыть регистрацию' : 'Закрыть регистрацию'}
            </button>
          ) : (
             <button
              className={`era11 ${isClosed ? 'registration-closed' : 'registration-open'}`}
              onClick={isClosed ? null : handleJoin}
            >
              {isClosed ? 'Регистрация закрыта' : 'Регистрация открыта'}
            </button>
          )}
          {isAdmin && <div className="adminGreeting">Привет, админ!</div>}
          <div className="adminInformation">Имя админа: {room.admin_id.firstName}</div>
        </div>
        <div className="era12">
          <div className="era13">
            <div className="era14">
              <img loading="lazy" srcSet="" className="era15" alt="Турнир" />
            </div>
            <div className="era16">
              <div className="era17">
                <div className="era18">Начало</div>
                <div className="era19">{room.gameTime}</div>
                <div className="era20">Тип турнира</div>
                <div className="era21">{room.formatPlay}</div>
                <div className="era20">Количество Игроков: {players.length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="era22">
          <div
            className={`era23 ${view === 'players' ? 'active' : ''}`}
            onClick={() => handleViewChange('players')}
          >
            Игроки:
          </div>
          <div
            className={`era24 ${view === 'teams' ? 'active' : ''}`}
            onClick={() => handleViewChange('teams')}
          >
            Команды:
          </div>
        </div>
         {isAdmin && (
          <button type="submit" className='Generate' >
            Generate
          </button>
         )
         }
        {isCaptain &&
          <div>
            <form onSubmit={createTeam}>
              <input
                type="text"
                name="teamName"
                placeholder="Имя"
                value={teamData.teamName}
                onChange={handleChangePlayerName}
              />
              <button type="submit" onClick={createTeam}>
                ers
              </button>
            </form>
       
          </div>
        }
        <div className="era25">
          {view === 'info' && <div>{/* Общая информация о турнире */}</div>}
          {view === 'players' && (
             <div className="playersInfo">
             {players.length > 0 ? (
                 <ul>
                     {players.map((player) => (
                         <li key={player._id} onClick={() => handlePlayerClick(player.userId._id)}>
                             <span>
                                 {userDetails[player.userId._id]?._id} {userDetails[player.userId._id]?.firstName} {userDetails[player.userId._id]?.lastName}
                             </span>
                             {isAdmin && (
                                 <button  className='captainDelete'onClick={(e) => {
                                     e.stopPropagation(); // предотвращает вызов handlePlayerClick
                                     if (captains[player.userId._id]) {
                                       removeCaptain(player.userId._id);
                                     } else {
                                       assignCaptain(player.userId._id);
                                     }
                                 }}>
                                     {captains[player.userId._id] ? 'Убрать из капитана' : 'Назначить капитаном'}
                                 </button>
                             )}
                            {isCaptain && (
                                <>
                                  <button
                                    className=""
                                    onClick={(e) => {
                                      e.stopPropagation(); // предотвращает вызов handlePlayerClick
                                      addPlayerToTeam(player.userId._id);
                                    }}
                                  >
                                    Добавить в команду
                                  </button>
                                  <div className='teamss'>
                                  <div className='teamss'>
                                      {teams.length > 0 ? ( 
                                        <ul>
                                          {teams.map((team) => (
                                            <li key={team._id}>
                                              <button 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  console.log('era:', team._id);
                                                  console.log('rt',player.userId._id);
                                                  addPlayerToTeam(team._id, player.userId._id);
                                                }}
                                              >
                                                {team.teamName}
                                                {team._id2}
                                              </button>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (   
                                        <div>Нет команд</div>
                                      )}
                                    </div>

                                  </div>
                                </>
                              )}
                         </li>
                     ))}
                 </ul>
             ) : (
                 <div>Нет игроков</div>
             )}
         </div>
          )}
          {view === 'teams' && (
            <div>
              {teams.length > 0 ? (
                <ul>
                  {teams.map((team) => (
                    <li key={team._id}>{team.teamName}</li>
                  ))}
                </ul>
              ) : (
                <div>Нет команд</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomDetail;
