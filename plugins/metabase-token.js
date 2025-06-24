// plugins/metabase.js
import jwt from 'jsonwebtoken'

export default ({ $config }, inject) => {
  const generateToken = (dashboardId, expiresInMinutes = 15) => {
    try {
      // اعتبارسنجی ورودی‌ها
      if (!dashboardId || isNaN(dashboardId)) {
        throw new Error('شناسه داشبورد نامعتبر است')
      }

      // دریافت کلید مخفی از تنظیمات Nuxt
      const secretKey = '49f7c65fb745c34865500cd4c0936ce720a7eb35e218b137b82f4730073c401c'
      
      if (!secretKey) {
        throw new Error('کلید مخفی متابیس تنظیم نشده است')
      }

      // ساخت payload
      const payload = {
        resource: { dashboard: Number(dashboardId) },
        params: {},
        exp: Math.floor(Date.now() / 1000) + (expiresInMinutes * 60)
      }

      // تولید توکن با بررسی‌های اضافه
      if (typeof jwt.sign !== 'function') {
        throw new Error('تابع jwt.sign معتبر نیست')
      }

      return jwt.sign(payload, secretKey)
    } catch (error) {
      console.error('خطا در تولید توکن:', error)
      throw error
    }
  }
  inject('metabase', {
    getToken: generateToken
  })
}