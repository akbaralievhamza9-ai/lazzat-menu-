require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN  = '8826341236:AAEglwZ4U-Neam7q5RWhWlCJFoi8ykkccn0';
const ADMIN_ID   = '8054282752';
const WEBAPP_URL = 'https://akbaralievhamza9-ai.github.io/lazzat-menu-/';

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
        orderSuccess: (name, phone) => `🎉 *Буюртмаңыз кабыл алынды!*\n\n` +
                                       `👤 ${name} | 📞 ${phone}\n\n` +
                                       `⏱ Тамак 15-25 мүнөттө даяр болот!\n` +
                                       `🚖 Жеткирүү: 30 мүнөттөн 55 мүнөткө чейин!\n\n` +
                                       `📞 Суроо-жооп: @Lazzat_beshbarmagy`,
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
        orderSuccess: (name, phone) => `🎉 *Ваш заказ принят!*\n\n` +
                                       `👤 ${name} | 📞 ${phone}\n\n` +
                                       `⏱ Блюдо будет готово за 15-25 минут!\n` +
                                       `🚖 Доставка: от 30 до 55 минут!\n\n` +
                                       `📞 Вопросы: @Lazzat_beshbarmagy`,
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
        Markup.inlineKeyboard([[Markup.button.webApp(t.openMenu, WEBAPP_URL)]])
    );
});

// ═══════════════════════════════════
//  Web App — Mini App'тан буюртма
// ═══════════════════════════════════
bot.on('web_app_data', async (ctx) => {
    try {
        const data = JSON.parse(ctx.webAppData.data);
        const { name, phone, items, total } = data;
        const u = ctx.from;
        const lang = userLanguages[u.id] || 'ky';
        const t = TRANSLATIONS[lang];

        // Кардарга жооп
        await ctx.reply(t.orderSuccess(name, phone), { parse_mode: 'Markdown' });

        // Админге жөнөтүү
        await sendOrderToAdmin(bot, u, name, phone, items, total, 'Mini App');
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
            Markup.inlineKeyboard([[Markup.button.webApp(t.openMenu, WEBAPP_URL)]])
        );
    }

    if (text === t.btnOrder || text === '/order') {
        sessions[uid] = { step: 'ask_order' };
        return ctx.reply(
            t.orderPrompt,
            {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([[Markup.button.webApp(t.openMenu, WEBAPP_URL)]])
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
            Markup.inlineKeyboard([[Markup.button.webApp(t.openMenu, WEBAPP_URL)]])
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

// ═══════════════════════════════════
//  Заказды Админге жөнөтүү функциясы
// ═══════════════════════════════════
async function sendOrderToAdmin(bot, user, name, phone, items, total, source) {
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
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🕐 ${new Date().toLocaleString('ru-RU', {timeZone:'Asia/Bishkek'})}`;

    await bot.telegram.sendMessage(ADMIN_ID, msg, { parse_mode: 'Markdown' });
}

// ═══════════════════════════════════
//  Иштетүү
// ═══════════════════════════════════
bot.launch().then(() => {
    console.log('');
    console.log('✅ ══════════════════════════════');
    console.log('✅  @Lazzat_beshbarmagy_kg_bot');
    console.log('✅  ЭКИ ТИЛДЕ ИШТЕП ЖАТАТ! (KY/RU)');
    console.log(`✅  Admin: ${ADMIN_ID}`);
    console.log(`✅  WebApp: ${WEBAPP_URL}`);
    console.log('✅ ══════════════════════════════');
}).catch(err => {
    console.error('❌ КАТА:', err.message);
    process.exit(1);
});

// Render'де акысыз Web Service катары иштөө үчүн порт ачабыз
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`);
});

process.once('SIGINT',  () => { bot.stop('SIGINT'); server.close(); });
process.once('SIGTERM', () => { bot.stop('SIGTERM'); server.close(); });
