import React, { useEffect, useState } from 'react';
import "../styles/Stats.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Stats = () => {
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            if (!token || token === "undefined" || token === "null") {
                console.log("Token absent => redirection login");
                navigate("/login");
                return;
            }

            try {
                const res = await axios.get('http://localhost:5000/api/stats', {
                    headers: { Authorization: `Bearer ${token}`}
                });

                setStats(res.data);

            } catch (err) {
                console.error("Erreur fetch stats :", err.response?.data || err.message);

                // Si le token est expiré ou invalide => on nettoie tout
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");                       
            }
        };

        fetchStats();
    }, [navigate]);

    

    if (!stats) return <p>Chargement...</p>;


    // Data pour Pie chart (status)
    const pieData = {
        labels: ['Fini', 'En cours', 'À faire'],
        datasets: [
            {
                label: 'jeux par statut',
                data: [stats.finished || 0, stats.inProgress || 0, stats.toDo || 0],
                backgroundColor: ['#4caf50', '#2196f3', '#ff9800']
            }
        ]
    };

    // Option pour Pie
    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false
    };



    // Data pour Bar chart (note moyenne)
    const barData = {
        labels: ['Note moyenne'],
        datasets: [
            {
                label: 'Note moyenne',
                data: [stats.averageRating],
                backgroundColor: ['#f44336']
            }
        ],
     };
    
    // Option pour Bar
    const barOptions = { 
        responsive: true,
        maintainAspectRatio: false,
        scales: {y: { beginAtZero: true, max: 5 }}
    };
            


    return (
        <>
        <Header />
        <div className='stats-container'>
            <h2 className='stats-title'>Mes statistiques de jeux</h2>
            <p className='stats-total'>Total de jeux : {stats.totalGames}</p>


            <div className='stats-card'>
                <h3>Répartition par status</h3>
                <div className='chart-wrapper'>
                    <Pie data={pieData} options={pieOptions} />
                </div>
            </div>

            <div className='stats-card'>
                <h3>Note moyenne</h3>
                <div className='chart-wrapper average'>
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default Stats;