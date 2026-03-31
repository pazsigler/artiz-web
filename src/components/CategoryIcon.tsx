interface Props {
  slug: string;
  className?: string;
}

export default function CategoryIcon({ slug, className = "w-8 h-8" }: Props) {
  const icons: Record<string, React.ReactNode> = {
    // חגים - רימון
    holidays: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 0c-1 0-2 .5-2 .5S9 5.5 9 5s.5-1 1-1h4c.5 0 1 .5 1 1s-1 .5-2 .5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4c-4 0-7 3.5-7 8s3 9 7 9 7-4.5 7-9-3-8-7-8Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5m-3-2.5h6" />
      </svg>
    ),
    // סוף שנה - Graduation cap
    "end-of-year": (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15v-3.75m0 0h-.008v.008H6.75V11.25Z" />
      </svg>
    ),
    // יודאיקה - מגן דוד
    judaica: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l5.196 9H6.804L12 2Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22l-5.196-9h10.392L12 22Z" />
      </svg>
    ),
    // גיוס - כומתה
    army: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 17c0-1 2-3 8-3s8 2 8 3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 17c0-4 2.5-8 7-10 4.5 2 7 6 7 10" />
        <circle cx="7" cy="17" r="1" />
      </svg>
    ),
    // ימי הולדת - Cake
    birthday: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m18-4.5a23.72 23.72 0 0 0-3.48-.315M3 12a23.72 23.72 0 0 1 3.48-.315M3 12V6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 .75.75V12m-18 0v6a.75.75 0 0 0 .75.75h16.5a.75.75 0 0 0 .75-.75v-6" />
      </svg>
    ),
    // בלונים - Balloon (sparkles as placeholder)
    balloons: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-3.3 0-6 3.134-6 7 0 3.866 2.7 7 6 7s6-3.134 6-7c0-3.866-2.7-7-6-7Zm0 14v4m-2-2h4" />
      </svg>
    ),
    // מזכרות - נר
    souvenirs: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-.5 1-1.5 2-1.5 3 0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5c0-1-1-2-1.5-3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 8h4v12h-4V8Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 20h8" />
      </svg>
    ),
    // מארזים - Gift box
    packages: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
  };

  return icons[slug] || icons["packages"];
}
