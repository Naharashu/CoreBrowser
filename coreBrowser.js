const { app, BrowserWindow, ipcMain, session, globalShortcut, dialog} = require('electron')
const path = require('path')   
const fs = require('fs').promises

const blockedSites= [
    "*://*.zedo.com/*",
    "*://*.doubleclick.net/*",
    "*://*.google-analytics.com/*",
    "*://*.ad.doubleclick.net/*",
    "*://*.browser.sentry-cdn.com/*",
    "*://*.app.getsentry.com/*",
    "*://*.ad.yahoo.com/*",
    "*://*.ads.yahoo.com/*",
    "*://*.analytics.yahoo.com/*",
    "*://*.analytics.s3.amazonaws.com/*",
    "*://*.metrics.data.hicloud.com/*",
    "*://*.adtago.s3.amazonaws.com/*",
    "*://*.advice-ads.s3.amazonaws.com/*",
    "*://*.sentry-cdn.com/*",
    "*://*.sentry.io/*",
    "*://*.sentry.dev/*",
    "*://*.googlesyndication.com/*",
    "*://*.googleadservices.com/*",
    "*://*.googletagmanager.com/*",
    "*://*.googletagservices.com/*",
    "*://*.gstatic.com/*",
    "*://*.ad.doubleclick.net/*",
    "*://*.adservice.google.com/*",
    "*://*.adwords.google.com/*",
    "*://*.analytics.google.com/*",
    "*://*.analytics.google.com/*",
    "*://*.spam.com/*",
    "*://*.adspam.com/*",
    "*://*.malware.com/*",
    "*://*.phishing.com/*",
    "*://*.scam.com/*",
    "*://*.coinhive.com/*",
    "*://*.crypto-loot.com/*",
    "*://*.minr.pw/*",
    "*://*.ru/*",
    "*://*.com.ru/*",
    "*://*.co.ru/*",
    "*://*.net.ru/*",
    "*://*.org.ru/*",
    "*://*.su/*",
    "*://*.com.su/*",
    "*://*.co.su/*",
    "*://*.net.su/*",
    "*://*.org.su/*",
    "*://*.free/*",
    "*://*.unityads.unity3d.com/*",
    "*://*.cn/*",
    "*://*.tiktok.com/*",
    "*://*.tiktokcdn.com/*",
    "*://*.tiktokv.com/*",
    "*://*.tiktokapi.com/*",
    "*://*.tiktokcdn.com/*",
    "*://*.tiktokv.com/*",
    "*://*.temu.com/*",
    "*://*.temu.us/*",
    "*://*.temu.co/*",
    "*://*.temu.net/*",
    "*://*.rf/*",
    "*://*.facebook.com/*",
    "*://*.twitter.com/*",
    "*://*.instagram.com/*",
    "*://*.pinterest.com/*",
    "*://*.snap.com/*",
    "*://*.4bidden.info/*",
    "*://*.agebooter.com/*",
    "*://*.alphastress.com/*",
    "*://*.anonboot.com/*",
    "*://*.anonsecurityteam.com/*",
    "*://*.anonymous-stresser.com/*",
    "*://*.anonymous-stresser.net/*",
    "*://*.api-stresser.me/*",
    "*://*.apocalypse-solutions.com/*",
    "*://*.arkbooter.fr/*",
    "*://*.assasinsbooter.altervista.org/*",
    "*://*.astrostress.com/*",
    "*://*.atom-stresser.com/*",
    "*://*.atomstress.org/*",
    "*://*.aurastresser.com/*",
    "*://*.avengestresser.com/*",
    "*://*.b-h.us/*",
    "*://*.battle.pw/*",
    "*://*.begayage-stresser.com/*",
    "*://*.bemybooter.eu/*",
    "*://*.best-ddos-tool.ilovecassola.it/*",
    "*://*.beststresser.com/*",
    "*://*.blink-stresser.000webhostapp.com/*",
    "*://*.blunter.xyz/*",
    "*://*.acheter-des-bitcoin.com/*",
    "*://*.acytem.pw/*",
    "*://*.ad2bitcoin.com/*",
    "*://*.aeexc.lat/*",
    "*://*.airplus.website/*",
    "*://*.algo-revolution.com/*",
    "*://*.alt.litebonk.com/*",
    "*://*.alvarez.sfek.kz/*",
    "*://*.anc.coinpool.in/*",
    "*://*.api-stratum.bitcoin.cz/*",
    "*://*.api.bitcoin.cz/*",
    "*://*.api2.bitcoin.cz/*",
    "*://*.arsbitcoin.com/*",
    "*://*.asc.coinmine.pl/*",
    "*://*.au.ltcrabbit.com/*",
    "*://*.auroracoin.org/*",
    "*://*.autosurfdusoleil.com/*",
    "*://*.backup-pool1.com/*",
    "*://*.bfc.dsync.net/*",
    "*://*.bfgminer.org/*",
    "*://*.bibox.com/*",
    "*://*.bigzone.xyz/*",
    "*://*.binance.com/*",
    "*://*.binance2giga.link/*",
    "*://*.bitcanna.io/*",
    "*://*.bitclockers.com/*",
    "*://*.bitcoin-champion.com/*",
    "*://*.bitcoin-formation.club/*",
    "*://*.bitcoin-hausse.com/*",
    "*://*.bitcoin-pas-chere.com/*",
    "*://*.bitcoin-patrimoine.com/*",
    "*://*.bitcoin-server.de/*",
    "*://*.bitcoin-storm.com/*",
    "*://*.bitcoin.de/*",
    "*://*.bitcoin.it/*"
]


const dynamicAdFilters = [
    '*://*/ads.js',
    '*://*/ad.js',
    '*://*/banner.js',
    '*://*/analytic.js',
    '*://*/analytics.js',
    '*://*/advertisement.js',
    '*://*/adframe.js',
    '*://*/*banner*',
    '*://*/*popup*',
    '*://*/*adsense*',
    '*://pagead2.googlesyndication.com/*',
    '*://*.hotjar.com/*',
    '*://*.criteo.com/*',
    '*://*.outbrain.com/*',
    '*://*.taboola.com/*',
    '*://*/*popunder*',
    '*://*/*lightbox*',
    '*://*/*modal*',
    '*://*/*interstitial*',
    '*://*/*ad-manager*',
    '*://*/*ad-loader*',
    '*://*/*ad-frame*',
    '*://*/*advertising*',
    '*://*/*bannerflow*',
    '*://*/*sponsored*',
    '*://*/*promotions*',
    '*://*.moatads.*/*',
    '*://*.heapanalytics.*/*',
    '*://*.optimizely.*/*',
    '*://*.mixpanel.*/*',
    '*://*.clicktale.*/*',
    '*://*.trackers.*/*',
    '*://*/dynamic/*ad*',
    '*://*/dynamic/*banner*',
    '*://*/dynamic/*promo*',
    '*://*/iframe/*ad*',
    '*://*/js/ads/*',
    '*://*/js/analytics/*',
    '*://*/prebid/*',
    '*://*/rtb/*',
    '*://*/banner/*.gif',
    '*://*/ads/*.gif',
    '*://*/promotions/*.gif',
    '*://*/animated-banner/*',
    '*://*/animated-ads/*',
    '*://*/animated-promotions/*',
    '*://*/animated-banners/*',
    '*://*/animated-ads/*'
];

const scriptFilters = [
    '*://*/pagead.js',
    '*://*/widget/ads.*',
    '*://*/ad-script.*',
    '*://*/advertisement.*',
    '*://*/banner.*',
    '*://*/sponsor.*',
    '*://*/tracker.*',
    '*://*/js/ads/loader.js',
    '*://*/js/advertisement.js',
    '*://*/js/sponsored.js',
    '*://*/js/tracking.js',
    '*://*/js/analytics.js',
    '*://*/js/metrics.js'
];

const blockedContentTypes = [
    'image',
    'script',
    'stylesheet',
    'xmlhttprequest'
];


function setupAdBlock(browserSession) {
    const blockedUrlCache = new Set();
    
    browserSession.webRequest.onBeforeRequest((details, callback) => {
        try {
            if (blockedUrlCache.has(details.url)) {
                callback({ cancel: true });
                return;
            }

            if (details.resourceType === 'script') {
                const isBlockedScript = scriptFilters.some(filter => {
                    const pattern = filter.replace(/\*/g, '').toLowerCase();
                    return details.url.toLowerCase().includes(pattern);
                });

                if (isBlockedScript) {
                    blockedUrlCache.add(details.url);
                    callback({ cancel: true });
                    return;
                }
            }

            const isDynamicAd = dynamicAdFilters.some(filter => {
                const pattern = filter.replace(/\*/g, '').toLowerCase();
                return details.url.toLowerCase().includes(pattern);
            });

            const isStaticAd = blockedSites.some(filter => {
                const pattern = filter.replace(/\*/g, '').toLowerCase();
                return details.url.toLowerCase().includes(pattern);
            });

            if (isDynamicAd || isStaticAd) {
                blockedUrlCache.add(details.url);
                callback({ cancel: true });
                return;
            }

            callback({ cancel: false });
        } catch (error) {
            console.error('Error:', error);
            callback({ cancel: false });
        }
    });


    browserSession.webRequest.onBeforeRequest({
        urls: ['<all_urls>'],
        types: ['popup']
    }, (details) => {
        return { cancel: true };
    });


    browserSession.webRequest.onHeadersReceived((details, callback) => {
        if (details.responseHeaders) {
            const headers = Object.entries(details.responseHeaders)
                .filter(([key]) => !key.toLowerCase().includes('x-frame-options'))
                .reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {});

            callback({
                responseHeaders: {
                    ...headers,
                    'Content-Security-Policy': [
                        "default-src 'self'",
                        "script-src 'self'",
                        "style-src 'self'",
                        "img-src 'self' data: https:",
                        "frame-src 'none'"
                    ].join('; ')
                }
            });
            return;
        }
        callback({});
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true,
            enableWebSQL: false,
            spellcheck: false,
            sandbox: true,
            plugins: false,
            webSecurity: true,
            webgl: true
        },
        backgroundColor: '#2e2c29',
        minWidth: 400,
        minHeight: 300,
    })

    win.once('ready-to-show', () => {
        win.show();
    });

    globalShortcut.register('CommandOrControl+F', () => {
        win.webContents.send('find-in-page');
    });

    setupAdBlock(win.webContents.session)
    win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        const blockedPermissions = ['tracking', 'notification'];
        if (blockedPermissions.includes(permission)) {
            callback(false);
        } else {
            const allowedPermissions = ['clipboard-read', 'clipboard-write'];
            callback(allowedPermissions.includes(permission));
        }
    });
    global.mainWindow = win;

    win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        const allowedPermissions = ['clipboard-read', 'clipboard-write'];
        callback(allowedPermissions.includes(permission));
    });

    ipcMain.on('open-devtools', () => {
        if (global.mainWindow && global.mainWindow.webContents) {
            global.mainWindow.webContents.openDevTools()
        }
    })

    ipcMain.on('close-window', () => {
        app.quit()
    })

    win.loadFile('index.html')
    
    
}



app.commandLine.appendSwitch('disable-background-update')
app.commandLine.appendSwitch('disable-geolocation')
app.commandLine.appendSwitch('disable-extensions-update')
app.commandLine.appendSwitch('disable-features', 'AutofillEnableProfileAutofill,AutofillEnableAddressAutofill');

app.whenReady().then(createWindow)


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on('close-window', () => {
    app.quit()
})

ipcMain.on('open-devtools', () => {
    BrowserWindow.getFocusedWindow().webContents.openDevTools();
});


async function saveHistory(url) {
    try {
        const historyPath = path.join(__dirname, 'history.json');
        let history = [];
        
        try {
            const data = await fs.readFile(historyPath, 'utf8');
            history = JSON.parse(data);
        } catch (error) {

        }

        history.unshift({
            url,
            timestamp: new Date().toISOString()
        });

        if (history.length > 1000) {
            history = history.slice(0, 1000);
        }

        await fs.writeFile(historyPath, JSON.stringify(history, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}


ipcMain.handle('save-history', async (event, url) => {
    await saveHistory(url);
});

ipcMain.handle('get-history', async () => {
    try {
        const historyPath = path.join(__dirname, 'history.json');
        const data = await fs.readFile(historyPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
});

ipcMain.handle('clear-history', async () => {
    try {
        const historyPath = path.join(__dirname, 'history.json');
        await fs.writeFile(historyPath, '[]');
    } catch (error) {
        console.error('Error:', error);
    }
});

ipcMain.handle('save-history', async (event, url) => {
    try {
        const historyPath = path.join(__dirname, 'history.json');
        let history = [];
        
        try {
            const data = await fs.readFile(historyPath, 'utf8');
            history = JSON.parse(data);
        } catch (error) {

        }

        history.unshift({
            url,
            timestamp: new Date().toISOString()
        });

   
        if (history.length > 1000) {
            history = history.slice(0, 1000);
        }

        await fs.writeFile(historyPath, JSON.stringify(history, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
});

ipcMain.handle('get-history', async () => {
    try {
        const historyPath = path.join(__dirname, 'history.json');
        const data = await fs.readFile(historyPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
});

ipcMain.handle('clear-history', async () => {
    try {
        const historyPath = path.join(__dirname, 'history.json');
        await fs.writeFile(historyPath, '[]');
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
});

ipcMain.on('load-url', (event, url) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.loadURL(url);
    }
});


ipcMain.handle('save-history', async (event, url) => {
    try {
        const historyPath = path.join(__dirname, 'history.json');
        let history = [];
        
        try {
            const data = await fs.readFile(historyPath, 'utf8');
            history = JSON.parse(data);
        } catch (error) {

        }

        history.unshift({
            url,
            timestamp: new Date().toISOString()
        });

        if (history.length > 1000) {
            history = history.slice(0, 1000);
        }

        await fs.writeFile(historyPath, JSON.stringify(history, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
});

ipcMain.handle('get-history', async () => {
    try {
        const historyPath = path.join(__dirname, 'history.json');
        const data = await fs.readFile(historyPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
});

ipcMain.handle('clear-history', async () => {
    try {
        const historyPath = path.join(__dirname, 'history.json');
        await fs.writeFile(historyPath, '[]');
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
});

ipcMain.on('load-url', (event, url) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.loadURL(url);
    }
});