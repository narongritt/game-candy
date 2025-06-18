# 🍎 Fruit Crush Game 🍇

เกมจับคู่ผลไม้สุดน่ารักที่สร้างด้วย React + TypeScript + Vite

## 🎮 วิธีเล่น (How to Play)

### **เป้าหมายของเกม**
- จับคู่ผลไม้ชนิดเดียวกัน 3 ลูกขึ้นไปในแนวเส้นตรง (แนวนอนหรือแนวตั้ง)
- ทำคะแนนให้ถึงเป้าหมายของแต่ละระดับ
- ใช้จำนวนการเคลื่อนไหวให้มีประสิทธิภาพที่สุด

### **การเล่นขั้นพื้นฐาน**

1. **การเลือกผลไม้**: คลิกที่ผลไม้ลูกแรกที่ต้องการเลื่อน
2. **การสลับตำแหน่ง**: คลิกที่ผลไม้ที่อยู่ติดกัน (ข้างๆ หรือ ข้างบน/ล่าง) เพื่อสลับตำแหน่ง
3. **การจับคู่**: เมื่อผลไม้ชนิดเดียวกัน 3 ลูกขึ้นไปเรียงกันเป็นแนวเส้นตรง พวกมันจะหายไป
4. **การตกลงมา**: ผลไม้ที่อยู่ข้างบนจะตกลงมาเติมตำแหน่งที่ว่าง
5. **การเติมใหม่**: ผลไม้ใหม่จะปรากฏที่ด้านบนเพื่อเติมกระดาน

### **ระบบคะแนน**

- **การจับคู่พื้นฐาน**: 100 คะแนนต่อผลไม้ 1 ลูก
- **โบนัสการจับคู่ใหญ่**: 
  - 4 ลูก: +300 คะแนนโบนัส
  - 5 ลูก: +800 คะแนนโบนัส
  - 6+ ลูก: +1,500 คะแนนโบนัส
- **คอมโบ (Combo)**: เมื่อการจับคู่ครั้งหนึ่งนำไปสู่การจับคู่ต่อเนื่อง จะได้คะแนนเพิ่ม
  - คอมโบสูงสุด: 8x
  - โบนัสคอมโบพิเศษ:
    - 3x: +10% ของคะแนนรวม
    - 4x ขึ้นไป: +25% ของคะแนนรวม
    - 6x ขึ้นไป: +50% ของคะแนนรวม
- **โบนัสเวลา**: เมื่อผ่านระดับ จะได้คะแนนโบนัส 50 คะแนนต่อการเคลื่อนไหวที่เหลือ

### **เงื่อนไขการชนะและแพ้**

**🏆 ชนะระดับ**: 
- ทำคะแนนให้ถึงเป้าหมายของระดับนั้น
- เกมจะเลื่อนไปยังระดับถัดไปโดยอัตโนมัติภายใน 2.5 วินาที
- เมื่อผ่านทุกระดับ (15 ระดับ) จะได้รับตำแหน่ง "Ultimate Fruit Crush Master"

**💔 แพ้เกม**:
- หมดจำนวนการเคลื่อนไหวและยังทำคะแนนไม่ถึงเป้าหมาย
- ไม่มีการเคลื่อนไหวที่เป็นไปได้บนกระดาน

### **จำนวน Moves ที่ได้ในแต่ละระดับ**

- **Level 1**: 15 moves (เป้าหมาย: 1,000 คะแนน)
- **Level 2**: 18 moves (เป้าหมาย: 2,500 คะแนน)
- **Level 3**: 22 moves (เป้าหมาย: 5,000 คะแนน)
- **Level 4**: 25 moves (เป้าหมาย: 8,500 คะแนน)
- **Level 5**: 28 moves (เป้าหมาย: 13,000 คะแนน)
- **Level 6**: 32 moves (เป้าหมาย: 18,500 คะแนน)
- **Level 7**: 35 moves (เป้าหมาย: 25,000 คะแนน)
- **Level 8**: 38 moves (เป้าหมาย: 33,000 คะแนน)
- **Level 9**: 42 moves (เป้าหมาย: 42,500 คะแนน)
- **Level 10**: 45 moves (เป้าหมาย: 54,000 คะแนน)

### **เป้าหมายคะแนนแต่ละระดับ**

- **Level 1**: 1,000 คะแนน
- **Level 2**: 2,500 คะแนน
- **Level 3**: 5,000 คะแนน
- **Level 4**: 8,500 คะแนน
- **Level 5**: 13,000 คะแนน
- **Level 6**: 18,500 คะแนน
- **Level 7**: 25,000 คะแนน
- **Level 8**: 33,000 คะแนน
- **Level 9**: 42,500 คะแนน
- **Level 10**: 54,000 คะแนน

### **เป้าหมายคะแนนแต่ละระดับ**

- **Level 1**: 2,000 คะแนน
- **Level 2**: 5,000 คะแนน
- **Level 3**: 10,000 คะแนน
- **Level 4**: 20,000 คะแนน
- **Level 5**: 35,000 คะแนน
- **Level 6**: 50,000 คะแนน
- **Level 7**: 75,000 คะแนน
- **Level 8**: 100,000 คะแนน
- **Level 9**: 150,000 คะแนน
- **Level 10**: 200,000 คะแนน

### **ประเภทผลไม้ในเกม**

- 🍎 **แอปเปิ้ล (Apple)** - สีแดง
- 🍊 **ส้ม (Orange)** - สีส้ม  
- 🍌 **กล้วย (Banana)** - สีเหลือง
- 🍇 **องุ่น (Grape)** - สีม่วง
- 🍓 **สตรอเบอร์รี่ (Strawberry)** - สีแดงชมพู
- 🥝 **กีวี่ (Kiwi)** - สีเขียว

### **ระบบความสำเร็จ (Achievements)**

เกมมีระบบ Achievement ที่จะปลดล็อกเมื่อทำตามเงื่อนไข:

- 🍭 **First Match**: จับคู่ครั้งแรก
- 🔥 **Combo Master**: ทำคอมโบ 5x
- ⭐ **High Scorer**: ทำคะแนน 10,000 คะแนน
- 🌟 **Super Scorer**: ทำคะแนน 50,000 คะแนน
- 💫 **Mega Scorer**: ทำคะแนน 100,000 คะแนน
- 💥 **Fruit Crusher**: ทำลายผลไม้ 100 ลูก
- 💣 **Fruit Destroyer**: ทำลายผลไม้ 500 ลูก
- 🎯 **Efficiency Expert**: ทำคะแนน 10,000 คะแนนด้วยการเคลื่อนไหว 15 ครั้งหรือน้อยกว่า
- 👑 **Level Master**: ถึงระดับ 5
- 🏆 **Ultimate Champion**: ถึงระดับ 10
- ⚡ **Combo Legend**: ทำคอมโบ 8x

### **เทคนิคการเล่น**

1. **มองหาการจับคู่ที่ทำให้เกิดคอมโบ**: พยายามสร้างการจับคู่ที่จะนำไปสู่การจับคู่ต่อเนื่อง เพื่อได้คอมโบสูง ๆ
2. **จับคู่ผลไม้ให้มาก ๆ**: พยายามจับคู่ 4-6 ลูกขึ้นไปเพื่อได้โบนัสพิเศษ
3. **เล่นจากด้านล่างก่อน**: การเคลื่อนไหวที่ด้านล่างมักจะส่งผลต่อส่วนบนมากกว่า
4. **ประหยัดการเคลื่อนไหว**: คิดก่อนทำทุกครั้ง เพราะมี 25 ครั้งต่อระดับ
5. **มองหาการสร้างคอมโบยาว**: คอมโบ 5x ขึ้นไปจะให้โบนัสพิเศษมาก
6. **วางแผนล่วงหน้า**: คิดถึงผลลัพธ์ที่จะเกิดขึ้นหลังจากผลไม้ตกลงมา

### **ฟีเจอร์พิเศษ**

- 🔊 **เสียงเอฟเฟกต์**: เสียงประกอบการเล่นที่สมจริง
- 📳 **Haptic Feedback**: การสั่นสะเทือนบนอุปกรณ์ที่รองรับ
- 🎨 **กราฟิกสวยงาม**: ดีไซน์สีสันสดใสและ Animation เรียบลื่น
- 📊 **ติดตามสถิติ**: ระบบติดตามผลงานและความก้าวหน้า

---

## 🚀 การติดตั้งและรันเกม

### การติดตั้ง Dependencies
```bash
npm install
```

### รันเกมในโหมด Development
```bash
npm run dev
```

### Build เกมสำหรับ Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

---

## 🛠️ เทคโนโลยีที่ใช้

This project uses React + TypeScript + Vite with the following features:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


## 🔧 การปรับแต่ง ESLint

สำหรับการพัฒนาแอปพลิเคชัน Production แนะนำให้อัพเดต configuration เพื่อเปิดใช้งาน type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

คุณยังสามารถติดตั้ง [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) และ [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) สำหรับ React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
