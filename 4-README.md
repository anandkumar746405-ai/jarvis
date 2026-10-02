# JARVIS - Mera Apna AI Assistant

Ek chhota JARVIS jaisa assistant jo **browser me chalta hai** - phone, laptop, desktop, sab pe.
Tum bol ke ya type karke sawal poochho, wo Google Gemini AI se jawab dega (Hindi, English, Hinglish teeno chalte hain).

## Version 1 me kya hai
- Dark, futuristic JARVIS style screen
- Type karke poochho, ya 🎤 mic dabake bolo
- Jawab bol ke bhi sunata hai (🔊 button se band kar sakte ho)
- Chat yaad rakhta hai (jab tak page khula hai)
- Tumhari Gemini key sirf tumhare browser me save hoti hai

## Kya NAHI hai (abhi)
- Phone ke apps kholna, WhatsApp message bhejna, files dhundhna - ye V1 me nahi hai. Aage step by step jodenge.
- Page refresh karne pe chat history chali jaati hai.

## Step 1: Free Gemini API key lo
1. Browser me jao: https://aistudio.google.com/apikey
2. Apne Google account se login karo.
3. **Create API key** dabao.
4. Jo lambi key (`AIza...` se shuru) aaye use copy karlo.
5. Ye key kisi ko mat dikhana, na GitHub pe daalna. Ye password jaisi hai.

(Free tier me limit hoti hai - bahut zyada sawal ek saath bhejoge to "quota" error aa sakta hai. Thodi der ruko, phir chalega.)

## Step 2: App chalao (laptop/desktop pe)
Mic ke liye app ko `localhost` ya `https` se kholna padta hai, seedha file double-click se nahi.

1. Is repo ko download karo (green **Code** button -> **Download ZIP**) aur unzip karo. Ya `git clone` karo.
2. Folder me terminal kholo.
3. Python hai to ye chalao:
   ```
   python -m http.server 8000
   ```
   (Mac/Linux pe `python3 -m http.server 8000`)
4. Chrome ya Edge me kholo: http://localhost:8000
5. ⚙ **Settings** dabao, apni key paste karo, **Save** dabao.
6. Mic dabao, "Allow" karo, aur bolo. Ya type karo. Ho gaya!

## Step 3: Phone pe chalao
**Aasan tareeka:** Is project ko GitHub Pages pe daalo, phir phone pe https link se khulega.
1. GitHub repo me **Settings -> Pages**.
2. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`, **Save**.
3. 1-2 minute baad link milega, jaise `https://TUMHARA-NAAM.github.io/REPO-NAAM/`.
4. Phone ke Chrome me kholo, Settings me key daalo (har device pe ek baar).

## App ki tarah install karo (PWA)
Jab app https link (GitHub Pages) se khule:
- **Android Chrome:** menu (3 dots) -> **Install app** / **Add to Home screen**.
- **Laptop/Desktop Chrome/Edge:** address bar me install icon dabao.
- **iPhone Safari:** Share -> **Add to Home Screen**.
Phir ye alag app ki tarah khulega, bina browser bar ke. Pehli baar load hone ke baad screen offline bhi khulti hai (jawab ke liye internet chahiye).

## Files
- `index.html` - screen ka structure
- `style.css` - dikhne ka style (colors, glow)
- `app.js` - asli kaam: Gemini ko sawal bhejna, mic, bolna
- `manifest.json`, `sw.js`, `icon-*.png` - install karne aur offline ke liye
- `README.md` - ye file

## Problem aaye to
| Dikkat | Kya karo |
|---|---|
| Mic kaam nahi kar raha | Chrome/Edge use karo, mic permission Allow karo, `localhost` ya `https` se kholo |
| "API key not valid" | Key dobara copy karke Settings me daalo |
| "quota" / "429" error | Free limit khatam, thodi der ruko |
| "model not found" | Settings me Model naam badlo (AI Studio me current naam dekho) |
| Hindi me mic galat sun raha | Settings me language Hindi/English badal ke dekho |

## Aage kya banaye (ideas)
1. Chat ko save karna (localStorage)
2. Wake word: "Hey Jarvis"
3. Time, weather jaise chhote tools
4. Phone pe app jaisa install (PWA)

Seekhte raho, banate raho. 🚀
