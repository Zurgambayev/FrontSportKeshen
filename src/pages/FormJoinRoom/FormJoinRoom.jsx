import React,{ useState,useEffect } from "react";
import axiosInstance from '../../axiosService';

const FormJoinRoom = () => {

    const [formData, setFormData] = useState({
        position: '',
        preferredFoot: '',
        strengths: '',
        weaknesses: '',
        height: '',
        weight: ''
      });

      const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value});
      };
      const handleFormJoin = async(e) => {
        e.preventDefault(); // предотвращает перезагрузку страницы
        try{
            const response = await axiosInstance.post(`join-room`,formData,{
                headers:{
                     'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Пользователь успешно зашел в турнир', response.data);
        } catch (err) {
            console.error('Ошибка при входе в турнир', err.response.data);
        }
      }
      return (
        <form onSubmit={handleFormJoin}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tournament Name" required />
            <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" required />
            <input type="text" name="preferredFoot" value={formData.preferredFoot} onChange={handleChange} placeholder="Preferred Foot" required />
            <input type="text" name="strengths" value={formData.strengths} onChange={handleChange} placeholder="Strengths" required />
            <input type="text" name="weaknesses" value={formData.weaknesses} onChange={handleChange} placeholder="Weaknesses" required />
            <input type="text" name="height" value={formData.height} onChange={handleChange} placeholder="Height" required />
            <input type="text" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight" required />
            <button type="submit">Join Room</button>
        </form>
    );
}

export default FormJoinRoom;