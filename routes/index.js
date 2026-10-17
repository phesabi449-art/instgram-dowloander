const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// Instagram Scraper Stable API
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'YOUR_RAPIDAPI_KEY_HERE';
const RAPIDAPI_HOST = 'instagram-scraper-api2.p.rapidapi.com';

app.get('/', (req, res) => {
    res.json({ message: '✅ Instagram API çalışıyor!' });
});

app.get('/api/instagram/:username', async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: 'Kullanıcı adı gerekli' });
    }

    try {
        console.log(`Aranıyor: ${username}`);

        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST
            }
        };

        const response = await fetch(
            `https://${RAPIDAPI_HOST}/v1/user_info?user_id=${username}`,
            options
        );

        if (!response.ok) {
            console.log(`Hata: ${response.status}`);
            return res.status(404).json({ 
                error: 'Profil bulunamadı',
                status: response.status 
            });
        }

        const data = await response.json();

        const profileData = {
            username: data.username || username,
            full_name: data.full_name || '',
            biography: data.biography || '',
            profile_pic_url: data.profile_pic_url || '',
            profile_pic_url_hd: data.profile_pic_url || '',
            is_verified: data.is_verified || false,
            followers: data.followers || 0,
            following: data.following || 0,
            posts: data.posts || 0,
            is_private: data.is_private || false
        };

        console.log(`✅ Başarılı: ${username}`);
        res.json(profileData);

    } catch (error) {
        console.error('Hata:', error.message);
        res.status(500).json({ 
            error: 'Sunucu hatası',
            message: error.message 
        });
    }
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Server çalışıyor: Port ${listener.address().port}`);
});
