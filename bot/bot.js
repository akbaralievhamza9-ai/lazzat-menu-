require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN  = '8826341236:AAEglwZ4U-Neam7q5RWhWlCJFoi8ykkccn0';
const ADMIN_CHATS = ['8054282752', '@lazzt_beshbarmagy'];
const WEBAPP_URL = 'https://akbaralievhamza9-ai.github.io/lazzat-menu-/';

function getWebAppUrl() {
    const api = process.env.RENDER_EXTERNAL_URL || '';
    return `${WEBAPP_URL}?api=${encodeURIComponent(api)}`;
}

const bot = new Telegraf(BOT_TOKEN);
const sessions = {}; // Кардарлардын кадамдары

// 🌐 Тил сактоо файл
const LANG_FILE = path.join(__dirname, 'user_languages.json');
let userLanguages = {};
if (fs.existsSync(LANG_FILE)) {
    try {
        userLanguages = JSON.parse(fs.readFileSync(LANG_FILE, 'utf-8'));
    } catch(e) {
        console.error('Error reading language file:', e);
    }
}
function saveLanguage(uid, lang) {
    userLanguages[uid] = lang;
    try {
        fs.writeFileSync(LANG_FILE, JSON.stringify(userLanguages, null, 2), 'utf-8');
    } catch(e) {
        console.error('Error saving language file:', e);
    }
}

// 🌐 Тил котормолору
const TRANSLATIONS = {
    ky: {
        welcome: (name) => `🏔 *Ассалому алейкум, ${name}!*\n\n` +
                           `🍽 *«ЛАЗЗАТ БЕШ БАРМАК»* ресторанына кош келиңиз!\n\n` +
                           `🥘 Беш бармак, Шашлык, Пицца, Манты, Шорпо жана дагы көп тамактар!\n` +
                           `⏱ Тамак 15-25 мүнөттө даяр болот\n` +
                           `🚖 Жеткирүү: 30 мүнөттөн 55 мүнөткө чейин\n` +
                           `✅ Кызмат акысы: 0%\n\n` +
                           `👇 Менюну ачып буюртма бериңиз:`,
        openMenu: '📱 Менюну ачуу',
        btnMenu: '🍽 Меню',
        btnOrder: '🛒 Буюртма берүү',
        btnContact: '📞 Байланыш',
        btnInfo: 'ℹ️ Маалымат',
        orderPrompt: '📝 Каалаган тамактарды жазыңыз:\nМисалы: _Казак Беш Бармак 2шт, Шашлык 3шт_\n\nЖе менюдан тандаңыз:',
        namePrompt: '✍️ Атыңызды жазыңыз:',
        phonePrompt: '📞 Телефон номериңиз:\nМисалы: +996 700 000 000',
        orderSuccess: (name, phone) => `🎉 *Урматтуу ${name}, буюртмаңыз ийгиликтүү кабыл алынды!* \n\n` +
                                       `⏱ Тамагыңыз *15-25 мүнөттө* даяр болот!\n` +
                                       `🚖 Жеткирүү убактысы: *30-55 мүнөт* аралыгында.\n\n` +
                                       `Даамдуу тамактанууну каалайбыз! Бизди тандаганыңыз үчүн терең ыраазычылык билдиребиз! 💖\n\n` +
                                       `📞 Суроолор боюнча: @Lazzat_beshbarmagy`,
        contactText: `📞 *Байланыш:*\n\n` +
                     `☎️ Телефон: +996 705 123 456\n` +
                     `📍 Дарек: Бишкек шаары\n` +
                     `🕐 Иш убактысы: 09:00 - 23:00\n` +
                     `📱 Telegram: @Lazzat_beshbarmagy`,
        infoText: `ℹ️ *ЛАЗЗАТ БЕШ БАРМАК*\n\n` +
                  `🥘 Кыргыз улуттук тамактары\n` +
                  `⏱ Буюртма 15-25 мүнөттө даяр\n` +
                  `🚖 Жеткирүү: 30-55 мүнөт\n` +
                  `✅ Кызмат акысы: 0%\n\n` +
                  `Биздин даамдуу тамактарга буюртма бериңиз!`,
        selectLanguage: '🌐 Сураныч, төмөнкү баскычты басып менюну ачыңыз:',
        changeLanguage: '🌐 Тилди өзгөртүү'
    },
    ru: {
        welcome: (name) => `🏔 *Здравствуйте, ${name}!*\n\n` +
                           `🍽 Добро пожаловать в ресторан *«ЛАЗЗАТ БЕШ БАРМАК»*!\n\n` +
                           `🥘 Бешбармак, Шашлык, Пицца, Манты, Супы и многое другое!\n` +
                           `⏱ Время приготовления: 15-25 минут\n` +
                           `🚖 Доставка: от 30 до 55 минут\n` +
                           `✅ Обслуживание: 0%\n\n` +
                           `👇 Откройте меню и сделайте заказ:`,
        openMenu: '📱 Открыть меню',
        btnMenu: '🍽 Меню',
        btnOrder: '🛒 Сделать заказ',
        btnContact: '📞 Контакты',
        btnInfo: 'ℹ️ Информация',
        orderPrompt: '📝 Напишите желаемые блюда:\nНапример: _Казахский Бешбармак 2шт, Шашлык 3шт_\n\nИли выберите в меню:',
        namePrompt: '✍️ Напишите ваше имя:',
        phonePrompt: '📞 Ваш номер телефона:\nНапример: +996 700 000 000',
        orderSuccess: (name, phone) => `🎉 *Уважаемый(ая) ${name}, ваш заказ успешно принят!* \n\n` +
                                       `⏱ Блюдо будет готово за *15-25 минут*!\n` +
                                       `🚖 Время доставки: от *30 до 55 минут*.\n\n` +
                                       `Приятного аппетита! Искренне благодарим вас за выбор нашего ресторана! 💖\n\n` +
                                       `📞 По всем вопросам: @Lazzat_beshbarmagy`,
        contactText: `📞 *Контакты:*\n\n` +
                     `☎️ Телефон: +996 705 123 456\n` +
                     `📍 Адрес: г. Бишкек\n` +
                     `🕐 Время работы: 09:00 - 23:00\n` +
                     `📱 Telegram: @Lazzat_beshbarmagy`,
        infoText: `ℹ️ *ЛАЗЗАТ БЕШ БАРМАК*\n\n` +
                  `🥘 Киргизская национальная кухня\n` +
                  `⏱ Готовность заказа: 15-25 минут\n` +
                  `🚖 Доставка: 30-55 минут\n` +
                  `✅ Обслуживание: 0%\n\n` +
                  `Заказывайте наши вкусные блюда!`,
        selectLanguage: '🌐 Пожалуйста, откройте меню, нажав на кнопку ниже:',
        changeLanguage: '🌐 Смена языка'
    }
};

// ═══════════════════════════════════
//  /start — ТИЛ ТАНДОО
// ═══════════════════════════════════
bot.start(async (ctx) => {
    await ctx.reply(
        `🌐 *Тилди тандаңыз / Выберите язык:*`,
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('🇰🇬 Кыргызча', 'lang_ky'),
                    Markup.button.callback('🇷🇺 Русский', 'lang_ru')
                ]
            ])
        }
    );
});

// 🌐 Тилди тандоо Callback
bot.action(/lang_(ky|ru)/, async (ctx) => {
    const lang = ctx.match[1];
    const uid = ctx.from.id;
    saveLanguage(uid, lang);
    await ctx.answerCbQuery();
    
    const name = ctx.from.first_name || 'Кардар';
    const t = TRANSLATIONS[lang];
    
    // Тилге жараша негизги клавиатура
    const keyboard = Markup.keyboard([
        [t.btnMenu, t.btnOrder],
        [t.btnContact, t.btnInfo],
        [t.changeLanguage]
    ]).resize();
    
    try {
        await ctx.replyWithPhoto(
            'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
            {
                caption: t.welcome(name),
                parse_mode: 'Markdown',
                ...keyboard
            }
        );
    } catch(e) {
        await ctx.reply(t.welcome(name), keyboard);
    }
    
    await ctx.reply(
        t.selectLanguage, 
        Markup.inlineKeyboard([[Markup.button.webApp(t.openMenu, getWebAppUrl())]])
    );
});

// ═══════════════════════════════════
//  Web App — Mini App'тан буюртма
// ═══════════════════════════════════
bot.on('web_app_data', async (ctx) => {
    try {
        const data = JSON.parse(ctx.webAppData.data);
        const { name, phone, items, total, receipt } = data;
        const u = ctx.from;
        const lang = userLanguages[u.id] || 'ky';
        const t = TRANSLATIONS[lang];

        // Кардарга жооп
        await ctx.reply(t.orderSuccess(name, phone), { parse_mode: 'Markdown' });

        // Админге жөнөтүү (чек сүрөтү менен бирге)
        await sendOrderToAdmin(bot, u, name, phone, items, total, 'Mini App', receipt);
    } catch(e) {
        console.error(e);
        ctx.reply('⚠️ Ката. Кайрадан аракет кылыңыз / Ошибка. Попробуйте еще раз.');
    }
});

// ═══════════════════════════════════
//  Текст аркылуу буюртма жана баскычтар
// ═══════════════════════════════════
bot.on('text', async (ctx) => {
    const uid = ctx.from.id;
    const text = ctx.message.text;
    const s = sessions[uid];
    const lang = userLanguages[uid] || 'ky';
    const t = TRANSLATIONS[lang];

    // Тилди алмаштыруу
    if (text === '🌐 Тилди өзгөртүү' || text === '🌐 Смена языка' || text === '/lang') {
        return ctx.reply(
            `🌐 *Тилди тандаңыз / Выберите язык:*`,
            {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback('🇰🇬 Кыргызча', 'lang_ky'),
                        Markup.button.callback('🇷🇺 Русский', 'lang_ru')
                    ]
                ])
            }
        );
    }

    if (text === t.btnMenu || text === '/menu') {
        return ctx.reply(
            t.selectLanguage, 
            Markup.inlineKeyboard([[Markup.button.webApp(t.openMenu, getWebAppUrl())]])
        );
    }

    if (text === t.btnOrder || text === '/order') {
        sessions[uid] = { step: 'ask_order' };
        return ctx.reply(
            t.orderPrompt,
            {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([[Markup.button.webApp(t.openMenu, getWebAppUrl())]])
            }
        );
    }

    if (text === t.btnContact) {
        return ctx.reply(t.contactText, { parse_mode: 'Markdown' });
    }

    if (text === t.btnInfo) {
        return ctx.reply(t.infoText, { parse_mode: 'Markdown' });
    }

    if (!s) {
        return ctx.reply(
            t.selectLanguage,
            Markup.inlineKeyboard([[Markup.button.webApp(t.openMenu, getWebAppUrl())]])
        );
    }

    if (s.step === 'ask_order') {
        s.orderText = text;
        s.step = 'ask_name';
        return ctx.reply(t.namePrompt);
    }
    if (s.step === 'ask_name') {
        s.name = text;
        s.step = 'ask_phone';
        return ctx.reply(t.phonePrompt);
    }
    if (s.step === 'ask_phone') {
        s.phone = text;
        delete sessions[uid];

        await ctx.reply(t.orderSuccess(s.name, s.phone), { parse_mode: 'Markdown' });

        // Админге жөнөтүү
        const items = [{ name: s.orderText, price: 0, qty: 1 }];
        await sendOrderToAdmin(bot, ctx.from, s.name, s.phone, items, '—', `Текст (${lang.toUpperCase()})`);
    }
});

// 💾 Камдык файлдан (menu.json) менюну калыбына келтирүү
bot.on('document', async (ctx) => {
    const uid = ctx.from.id;
    if (String(uid) !== String(ADMIN_CHATS[0])) {
        return;
    }

    const doc = ctx.message.document;
    if (doc.file_name === 'menu.json') {
        try {
            await ctx.reply('⏳ ...');
            
            const fileUrl = await ctx.telegram.getFileLink(doc.file_id);
            const response = await fetch(fileUrl);
            const text = await response.text();
            
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) {
                fs.writeFileSync(MENU_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
                await ctx.reply('✅ @Lazzat_beshbarmagy_kg_bot: Меню ийгиликтүү калыбына келтирилди! Кардарлар жаңы менюну көрө алышат.');
            } else {
                await ctx.reply('❌ Ката: Файлдын ичиндеги маалымат туура эмес форматта.');
            }
        } catch(e) {
            console.error('Error restoring menu from file:', e);
            await ctx.reply('❌ Файлды окууда же сактоодо ката кетти: ' + e.message);
        }
    }
});

// ═══════════════════════════════════
//  Заказды Админге жөнөтүү функциясы
// ═══════════════════════════════════
async function sendOrderToAdmin(bot, user, name, phone, items, total, source, receipt = null) {
    let msg = `🚨 *ЖАҢЫ БУЮРТМА!* 🚨\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *Аты:* ${name}\n`;
    msg += `📞 *Тел:* ${phone}\n`;
    msg += `🆔 *TG ID:* ${user.id}\n`;
    if (user.username) msg += `👤 *@:* @${user.username}\n`;
    msg += `📲 *Аркылуу:* ${source}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📦 *БУЮРТМАЛАР:*\n`;
    items.forEach(i => {
        if (i.price > 0) {
            msg += `  • ${i.name} × ${i.qty} = *${i.price * i.qty} сом*\n`;
        } else {
            msg += `  • ${i.name}\n`;
        }
    });
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    if (total !== '—') msg += `💵 *ЖАЛПЫ: ${total} сом*\n`;
    if (source === 'Mini App') {
        msg += `💳 *Төлөм:* МБАНК аркылуу которулду\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🕐 ${new Date().toLocaleString('ru-RU', {timeZone:'Asia/Bishkek'})}`;

    const receiptBuffer = receipt ? Buffer.from(receipt.split(',')[1], 'base64') : null;

    for (const chat of ADMIN_CHATS) {
        try {
            if (receiptBuffer) {
                // Чек сүрөтү бар болсо, аны сүрөт катары жөнөтөбүз
                await bot.telegram.sendPhoto(
                    chat, 
                    { source: receiptBuffer }, 
                    { caption: msg, parse_mode: 'Markdown' }
                );
            } else {
                // Болбосо жөнөкөй текст жөнөтөбүз
                await bot.telegram.sendMessage(chat, msg, { parse_mode: 'Markdown' });
            }
        } catch(e) {
            console.error(`Failed to send order to chat ${chat}:`, e.message);
        }
    }
}

const MENU_FILE = path.join(__dirname, 'menu.json');
const secretPath = `/telegraf/${bot.secretPathComponent()}`;
const botMiddleware = bot.webhookCallback(secretPath);

// ═══════════════════════════════════
//  Иштетүү
// ═══════════════════════════════════
const domain = process.env.RENDER_EXTERNAL_URL;

async function onStart() {
    console.log('');
    console.log('✅ ══════════════════════════════');
    console.log('✅  @Lazzat_beshbarmagy_kg_bot');
    console.log('✅  ЭКИ ТИЛДЕ ИШТЕП ЖАТАТ! (KY/RU)');
    console.log(`✅  Admin Chats: ${ADMIN_CHATS.join(', ')}`);
    console.log(`✅  WebApp: ${WEBAPP_URL}`);
    console.log('✅ ══════════════════════════════');

    if (!fs.existsSync(MENU_FILE)) {
        try {
            await bot.telegram.sendMessage(
                ADMIN_CHATS[0],
                '🔄 *Сервер кайрадан ишке кирди!*\n\n' +
                'Эгер сиз буга чейин менюну өзгөрткөн болсоңуз (баалар, сүрөттөр ж.б.), акыркы `menu.json` камдык файлын мага жөнөтүп коюңуз. Мен аны автоматтык түрдө орнотуп алам. Рахмат!',
                { parse_mode: 'Markdown' }
            );
        } catch(err) {
            console.error('Failed to send restart notice to admin:', err.message);
        }
    }
}

if (domain) {
    // Render серверинде webhook режимин орнотобуз
    bot.telegram.setWebhook(`${domain}${secretPath}`).then(() => {
        console.log(`Webhook successfully configured at: ${domain}${secretPath}`);
        onStart();
    }).catch(err => {
        console.error('❌ WEBHOOK ОРНОТУУ КАТАСЫ:', err.message);
    });
} else {
    // Локалдык иштетүүдө polling (long-polling) колдонобуз
    bot.launch().then(() => {
        console.log('Bot started locally using long-polling.');
        onStart();
    }).catch(err => {
        console.error('❌ КАТА:', err.message);
        process.exit(1);
    });
}

// Render'де акысыз Web Service катары иштөө жана меню сактоо/жүктөө үчүн сервер
const http = require('http');
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Webhook үчүн Telegraf'ка беребиз
    if (req.method === 'POST' && req.url === secretPath) {
        return botMiddleware(req, res);
    }

    if (req.method === 'GET' && req.url === '/api/menu') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        if (fs.existsSync(MENU_FILE)) {
            try {
                const data = fs.readFileSync(MENU_FILE, 'utf-8');
                res.end(data);
                return;
            } catch(e) {
                console.error('Error reading menu file:', e);
            }
        }
        res.end(JSON.stringify([]));
    } 
    else if (req.method === 'POST' && req.url === '/api/menu') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const menuData = JSON.parse(body);
                fs.writeFileSync(MENU_FILE, JSON.stringify(menuData, null, 2), 'utf-8');
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true }));

                try {
                    await bot.telegram.sendDocument(
                        ADMIN_CHATS[0], 
                        { 
                            source: Buffer.from(JSON.stringify(menuData, null, 2)), 
                            filename: 'menu.json' 
                        }, 
                        { 
                            caption: '💾 *ЛАЗЗАТ МЕНЮ - КАМДЫК КӨЧҮРМӨ (BACKUP)*\n\n' +
                                     'Бул файл менюну серверден өчүп кеткенде калыбына келтирүү үчүн колдонулат.\n' +
                                     'Жөн гана бул файлды ботко кайра жөнөтсөңүз, меню калыбына келет.',
                            parse_mode: 'Markdown'
                        }
                    );
                } catch(err) {
                    console.error('Failed to send backup to admin:', err.message);
                }
            } catch(e) {
                console.error('Error parsing/writing menu:', e);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON');
            }
        });
    } 
    else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Lazzat Bot is running!');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`);
});

process.once('SIGINT',  () => { bot.stop('SIGINT'); server.close(); });
process.once('SIGTERM', () => { bot.stop('SIGTERM'); server.close(); });
