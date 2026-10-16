const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: '✅ Instagram Downloader çalışıyor!' });
});

app.get('/api/instagram/:username', async (req, res) => {
    const { username } = req.params;
    
    try {
        const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__w=1`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) return res.status(404).json({ error: 'Profil bulunamadı' });

        const data = await response.json();
        const user = data.graphql?.user;

        if (!user) return res.status(404).json({ error: 'Veri alınamadı' });

        res.json({
            username: user.username,
            full_name: user.full_name || '',
            biography: user.biography || '',
            profile_pic_url: user.profile_pic_url || '',
            profile_pic_url_hd: user.profile_pic_url_hd || user.profile_pic_url || '',
            is_verified: user.is_verified || false,
            followers: user.edge_followed_by?.paging_info?.total_count || 0,
            following: user.edge_follow?.paging_info?.total_count || 0,
            posts: user.edge_owner_to_timeline_media?.paging_info?.total_count || 0
        });

    } catch (error) {
        res.status(500).json({ error: 'Hata: ' + error.message });
    }
});

const listener = app.listen(process.env.PORT, () => {
    console.log('🚀 Server çalışıyor: ' + listener.address().port);
});
