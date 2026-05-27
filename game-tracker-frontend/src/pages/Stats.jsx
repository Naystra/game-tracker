import React, { useEffect, useState } from 'react';
import "../styles/Stats.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Enregistrement des modules Chart.js nécessaires aux graphiques Pie et Bar
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);


const API_URL = import.meta.env.VITE_API_URL;



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
                const res = await axios.get(`${API_URL}/api/stats`, {
                    headers: { Authorization: `Bearer ${token}`}
                });

                setStats(res.data);

            } catch (err) {
                console.error("Erreur fetch stats :", err.response?.data || err.message);

                // Si le token est expiré ou invalide => on nettoie tout et on redirige
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");                       
            }
        };

        fetchStats();
    }, [navigate]);   // Se re-exécute uniquement si navigate change 

    

    if (!stats) return <p>Chargement...</p>;


    // Pie chart : répartition des jeux par statut 
    const pieData = {
        labels: ['Fini', 'En cours', 'À faire'],
        datasets: [
            {
                label: 'jeux par statut',
                // || 0 : sécurité si une valeur est undefined ou null
                data: [stats.finished || 0, stats.inProgress || 0, stats.toDo || 0],
                // Vert = Fini, Bleu = En cours, Orange = À faire
                backgroundColor: ['#4caf50', '#2196f3', '#ff9800']
            }
        ]
    };

    const pieOptions = {
        responsive: true,            // S'adapte à la taille du conteneur
        maintainAspectRatio: false   // Utilise la taille définie en CSS
    };



    //  Bar chart : note moyenne 
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
    
    
    const barOptions = { 
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { 
                beginAtZero: true,  // L'axe Y commence à 0
                max: 5              // Maximum fixé à 5 
            }
        }
    };
            


    return (
        <>
        <Header />
        <div className='stats-container'>
            <h2 className='stats-title'>Mes statistiques de jeux</h2>
            <p className='stats-total'>Total de jeux : {stats.totalGames}</p>

            {/* Carte : camembert de répartition par statut */}
            <div className='stats-card'>
                <h3>Répartition par status</h3>
                <div className='chart-wrapper'>
                    <Pie data={pieData} options={pieOptions} />
                </div>
            </div>

            {/* Carte : barre de note moyenne */}
            <div className='stats-card'>
                <h3>Note moyenne : {stats.averageRating != null ? Number(stats.averageRating).toFixed(1) : 'N/A'} / 5</h3>
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