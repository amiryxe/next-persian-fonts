export default function Home() {
  return (
    <div className={`container py-8 flex flex-col gap-8`} dir="rtl">
      <div>
        <h1 className="font-sans font-light text-4xl">Next Persian Fonts</h1>
        <h2 className="font-bold text-2xl">پکیج مجموعه فونت‌های فارسی برای Next.js</h2>
      </div>

      <article>
        <p className="mt-8">در حال حاضر فونت‌های زیر در این پکیج پشتیبانی می‌شوند:</p>

        <ul className="list-disc pr-8">
          <li>فونت ساحل</li>
          <li>فونت وزیر</li>
        </ul>
      </article>

      <section>
        <h2>نصب:</h2>

        <code>npm install next-persian-fonts</code>
      </section>

      <section>
        <h2>استفاده:</h2>

        <code>
          {/* import {sahel} from '@/next-persian-fonts'
            <div
              className={`container py-8 flex flex-col gap-8 ${sahel.className}`}
            > */}
        </code>
      </section>
    </div>
  )
}
