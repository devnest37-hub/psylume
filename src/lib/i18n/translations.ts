export type Language = 'en' | 'ar' | 'fr'

export interface TranslationDict {
  common: {
    appName: string
    tagline: string
    loading: string
    save: string
    cancel: string
    delete: string
    edit: string
    add: string
    back: string
    close: string
    confirm: string
    search: string
    all: string
    views: string
    students: string
    resources: string
    duration: string
    pages: string
    format: string
    date: string
    category: string
    instructor: string
    module: string
    faculty: string
    new: string
    completed: string
    download: string
    bookmark: string
    remove: string
    share: string
  }
  nav: {
    home: string
    lectures: string
    years: string
    saved: string
    support: string
    menu: string
    springSemester: string
    examPeriodInfo: string
    viewLandingPage: string
    signIn: string
    signOut: string
    accountAndMode: string
    activeMode: string
    instructorCrud: string
    studentView: string
    viewAs: string
    student: string
    instructor: string
    admin: string
    studentTitle: string
    instructorTitle: string
    adminTitle: string
  }
  header: {
    searchPlaceholder: string
    notifications: string
    newInSpecialties: string
    signInRegister: string
    switchedToInstructor: string
    switchedToStudent: string
    breadcrumbs: {
      home: string
      lectures: string
      saved: string
      support: string
      dashboard: string
      year: string
      specialty: string
    }
  }
  home: {
    goodMorning: string
    goodAfternoon: string
    goodEvening: string
    publishedResourcesInstructor: string
    publishedResourcesStudent: string
    welcomeInstructor: string
    welcomeStudent: string
    academicYearsTitle: string
    academicYearsDesc: string
    addYear: string
    topSpecialtiesTitle: string
    topSpecialtiesDesc: string
    addSpecialty: string
    recentLecturesTitle: string
    recentLecturesDesc: string
    addLecture: string
    viewAllCatalog: string
    resumeTitle: string
    resumeProgress: string
    noLecturesYet: string
    noSpecialtiesYet: string
    noYearsYet: string
    totalStudents: string
    totalViews: string
  }
  lectures: {
    catalog: string
    allLectures: string
    resourcesCount: string
    matching: string
    searchPlaceholder: string
    allFormats: string
    allSpecialties: string
    allYears: string
    allCategories: string
    sortNewest: string
    sortViews: string
    resetFilters: string
    loadMore: string
    noLecturesFound: string
    noLecturesDesc: string
  }
  specialty: {
    faculty: string
    instructors: string
    enrolledStudents: string
    annualGrowth: string
    curriculum: string
    addSection: string
    editSpecialty: string
    deleteSpecialty: string
    manageSections: string
    noLecturesInSection: string
    beFirstToUpload: string
    backToYear: string
    sections: string
    specialties: string
    enrolledSpecialties: string
    step1: string
    step2: string
    academicYear: string
    lecturesAndFiles: string
    dynamicSections: string
    chooseSection: string
    addCustomSection: string
    noSectionsYet: string
    noSectionsDesc: string
    createFirstSection: string
    addLectureOrFile: string
    allFormats: string
    newestFirst: string
    mostViewed: string
    titleAZ: string
    noLecturesUploaded: string
    noLecturesSectionDesc: string
    noSpecialtiesYearTitle: string
    noSpecialtiesYearDesc: string
    pickSpecialtyDesc: string
    yearNotFound: string
    yearNotFoundDesc: string
    specialtyNotFound: string
    specialtyNotFoundDesc: string
    playlist: string
    continuousLearning: string
    chapters: string
    showMore: string
    showLess: string
    published: string
    notesPdf: string
    copiedToClipboard: string
  }
  saved: {
    title: string
    subtitle: string
    videosTab: string
    documentsTab: string
    historyTab: string
    clearHistory: string
    noSavedVideos: string
    noSavedVideosDesc: string
    noSavedDocs: string
    noSavedDocsDesc: string
    noHistory: string
    noHistoryDesc: string
    removeBookmark: string
    resume: string
    today: string
    yesterday: string
    thisWeek: string
    older: string
    openDoc: string
    browseCatalog: string
  }
  support: {
    title: string
    subtitle: string
    submitTicket: string
    issueType: string
    subject: string
    subjectPlaceholder: string
    description: string
    descriptionPlaceholder: string
    attachment: string
    sendTicket: string
    sending: string
    recentTickets: string
    faq: string
    ticketSentSuccess: string
    ticketCode: string
    statusOpen: string
    statusInProgress: string
    statusResolved: string
    issueTypes: {
      video: string
      document: string
      account: string
      upload: string
      network: string
      other: string
    }
  }
  auth: {
    signIn: string
    createAccount: string
    fullName: string
    fullNamePlaceholder: string
    email: string
    emailPlaceholder: string
    password: string
    faculty: string
    facultyPlaceholder: string
    testAccounts: string
    authenticating: string
    signInButton: string
    createButton: string
    noAccount: string
    haveAccount: string
    createOneNow: string
    signInHere: string
    instructorTest: string
    studentTest: string
  }
  modals: {
    saveChanges: string
    cancel: string
    delete: string
    confirmDelete: string
    cannotBeUndone: string
    addYearTitle: string
    editYearTitle: string
    deleteYearTitle: string
    addSpecialtyTitle: string
    editSpecialtyTitle: string
    deleteSpecialtyTitle: string
    addSectionTitle: string
    editSectionTitle: string
    deleteSectionTitle: string
    addLectureTitle: string
    editLectureTitle: string
    deleteLectureTitle: string
    yearName: string
    yearCode: string
    yearTagline: string
    specialtyName: string
    specialtyCode: string
    specialtyFaculty: string
    specialtyDesc: string
    sectionName: string
    sectionDisplayMode: string
    lectureTitle: string
    lectureDesc: string
    lectureModule: string
    lectureInstructor: string
    lectureFormat: string
    lectureDuration: string
    lecturePages: string
    lectureFile: string
    uploadFile: string
    dragAndDrop: string
    createYear: string
    updateYear: string
    createSpecialty: string
    updateSpecialty: string
    createSection: string
    updateSection: string
    createLecture: string
    updateLecture: string
    addYearSubtitle: string
    editYearSubtitle: string
    deleteYearWarning: string
    addSpecialtySubtitle: string
    editSpecialtySubtitle: string
    deleteSpecialtyWarning: string
    addSectionSubtitle: string
    editSectionSubtitle: string
    deleteSectionWarning: string
    addLectureSubtitle: string
    editLectureSubtitle: string
    deleteLectureWarning: string
    chooseIcon: string
    chooseCover: string
    selectYear: string
    selectSpecialty: string
    selectSection: string
    browseFile: string
    formatsAllowed: string
  }
  landing: {
    heroBadge: string
    heroTitle: string
    heroHighlight: string
    heroSubtitle: string
    enterPlatform: string
    exploreCatalog: string
    features: string
    platform: string
    forFaculty: string
    goToDashboard: string
    seeHowItWorks: string
    studentsActive: string
    liveCapture: string
    sampleLectureTitle: string
    academicYearsLabel: string
    disciplinesLabel: string
    resourcesLabel: string
    statEnrolled: string
    statVideos: string
    statResources: string
    statSatisfaction: string
    whatsInside: string
    featuresH2: string
    featuresH2Highlight: string
    feature1Title: string
    feature1Body: string
    feature2Title: string
    feature2Body: string
    itemsCount: string
    feature3Title: string
    feature3Body: string
    feature4Title: string
    feature4Body: string
    facultyTag: string
    facultyH2: string
    facultyDesc: string
    facultyPoint1: string
    facultyPoint2: string
    facultyPoint3: string
    enterAsFaculty: string
    ctaH2: string
    oneHub: string
    copyright: string
    footerLinks: string
    studentsEnrolled: string
    videoLecturesCount: string
    academicYearsCount: string
    activeFaculty: string
    featuresTitle: string
    featuresSubtitle: string
    feature1Desc: string
    feature2Desc: string
    feature3Desc: string
    ctaTitle: string
    ctaSubtitle: string
    ctaButton: string
  }
  player: {
    part: string
    lectureCapture: string
    upNext: string
    upNextIn: string
    playNow: string
    lectureComplete: string
    progressSaved: string
    replay: string
    pdfDocument: string
    studyNotes: string
    previousPage: string
    nextPage: string
    pageOf: string
    pages: string
    speed: string
    quality: string
    fullscreen: string
    exitFullscreen: string
    play: string
    pause: string
    nextLecture: string
    nextItem: string
    unmute: string
    mute: string
    captions: string
    settings: string
    zoomIn: string
    zoomOut: string
    fitWidth: string
    resetZoom: string
    downloadFile: string
    downloadOriginal: string
    page: string
    of: string
  }
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    common: {
      appName: 'Psylume',
      tagline: 'University Lecture Hub',
      loading: 'Loading academic resources…',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      back: 'Back',
      close: 'Close',
      confirm: 'Confirm',
      search: 'Search',
      all: 'All',
      views: 'views',
      students: 'students',
      resources: 'resources',
      duration: 'Duration',
      pages: 'pages',
      format: 'Format',
      date: 'Date',
      category: 'Section',
      instructor: 'Instructor',
      module: 'Module',
      faculty: 'Faculty',
      new: 'New',
      completed: 'Completed',
      download: 'Download File',
      bookmark: 'Bookmark',
      remove: 'Remove',
      share: 'Share',
    },
    nav: {
      home: 'Home',
      lectures: 'Lectures',
      years: 'Academic Years',
      saved: 'Saved',
      support: 'Support',
      menu: 'Menu',
      springSemester: 'Spring semester 2025',
      examPeriodInfo: "Exam period opens June 2. Past papers live in each specialty's Exam tab.",
      viewLandingPage: 'View Landing Page',
      signIn: 'Sign in',
      signOut: 'Sign Out',
      accountAndMode: 'Account & Mode',
      activeMode: 'Active Mode:',
      instructorCrud: 'Instructor (CRUD)',
      studentView: 'Student View',
      viewAs: 'View as',
      student: 'Student',
      instructor: 'Supervisor Instructor',
      admin: 'Administrator',
      studentTitle: 'Student',
      instructorTitle: 'Supervisor Instructor',
      adminTitle: 'System Admin',
    },
    header: {
      searchPlaceholder: 'Search lectures, TDs, exams, instructors…',
      notifications: 'Notifications',
      newInSpecialties: 'New in your specialties',
      signInRegister: 'Sign In / Register',
      switchedToInstructor: 'Switched to Supervisor Instructor mode (Full CRUD)',
      switchedToStudent: 'Switched to Student mode (Clean View)',
      breadcrumbs: {
        home: 'Home',
        lectures: 'Lectures',
        saved: 'Saved',
        support: 'Technical Support',
        dashboard: 'Dashboard',
        year: 'Academic Year',
        specialty: 'Specialty',
      },
    },
    home: {
      goodMorning: 'Good morning',
      goodAfternoon: 'Good afternoon',
      goodEvening: 'Good evening',
      publishedResourcesInstructor: 'Your faculty published {count} new resources this week.',
      publishedResourcesStudent: '{count} new resources landed in your specialties this week.',
      welcomeInstructor: 'Welcome to your instructor management portal.',
      welcomeStudent: 'Welcome to your academic study portal.',
      academicYearsTitle: 'Academic Years',
      academicYearsDesc: 'Browse lecture recordings, exercises and exams grouped by undergraduate and graduate study year.',
      addYear: 'Add Year',
      topSpecialtiesTitle: 'Top Specialties',
      topSpecialtiesDesc: 'High-engagement academic departments ranked by total lecture views.',
      addSpecialty: 'Add Specialty',
      recentLecturesTitle: 'Recent Lectures & Resources',
      recentLecturesDesc: 'Freshly published video lessons, exercise sheets and past exams across all specialties.',
      addLecture: 'Add Lecture',
      viewAllCatalog: 'View All Catalog',
      resumeTitle: 'Continue Watching',
      resumeProgress: '{percent}% completed',
      noLecturesYet: 'No lectures published yet.',
      noSpecialtiesYet: 'No specialties found in this academic year.',
      noYearsYet: 'No academic years created yet.',
      totalStudents: 'Enrolled students',
      totalViews: 'Total views',
    },
    lectures: {
      catalog: 'Catalog',
      allLectures: 'All Lectures',
      resourcesCount: '{filtered} of {total} resources',
      matching: 'matching “{query}”',
      searchPlaceholder: 'Filter by title, module, instructor…',
      allFormats: 'All Formats',
      allSpecialties: 'All Specialties',
      allYears: 'All Academic Years',
      allCategories: 'All Sections',
      sortNewest: 'Newest first',
      sortViews: 'Most viewed',
      resetFilters: 'Reset filters',
      loadMore: 'Load more resources',
      noLecturesFound: 'No lectures match your criteria',
      noLecturesDesc: 'Try loosening your search query or reset the filters to see the full repository.',
    },
    specialty: {
      faculty: 'Faculty',
      instructors: 'Faculty Instructors',
      enrolledStudents: 'Enrolled Students',
      annualGrowth: 'Annual Growth',
      curriculum: 'Curriculum Modules',
      addSection: 'Add Section',
      editSpecialty: 'Edit Specialty',
      deleteSpecialty: 'Delete Specialty',
      manageSections: 'Manage Sections',
      noLecturesInSection: 'No content available in this section yet',
      beFirstToUpload: 'Upload the first lecture or study document to get started.',
      backToYear: 'Back to {year}',
      sections: 'Sections',
      specialties: 'Specialties',
      enrolledSpecialties: 'Enrolled Specialties',
      step1: 'Step 1 of 2',
      step2: 'Step 2 of 2 · Choose a section',
      academicYear: 'Academic year',
      lecturesAndFiles: 'Lectures & Files',
      dynamicSections: 'Dynamic Sections',
      chooseSection: 'Choose a section',
      addCustomSection: 'Add Custom Section',
      noSectionsYet: 'No Sections Created Yet',
      noSectionsDesc: 'Dynamic sections organize course materials (e.g., Cours Magistraux, Travaux Dirigés, Examens, or custom modules). Create the first section to begin publishing lectures.',
      createFirstSection: '+ Create First Section',
      addLectureOrFile: 'Add Lecture / File',
      allFormats: 'All formats',
      newestFirst: 'Newest first',
      mostViewed: 'Most viewed',
      titleAZ: 'Title A–Z',
      noLecturesUploaded: 'No Lectures or Documents Uploaded Yet',
      noLecturesSectionDesc: 'No lectures or educational files have been published in this section yet.',
      noSpecialtiesYearTitle: 'No Specialties Enrolled in this Year',
      noSpecialtiesYearDesc: 'This academic year has no specialties attached yet. Add the first specialty to configure its dynamic sections and lectures.',
      pickSpecialtyDesc: 'Pick a specialty to open its dynamic sections (Cours, TD, Exam, Labs) for {year}.',
      yearNotFound: 'Year not found',
      yearNotFoundDesc: 'This academic year does not exist or has been removed.',
      specialtyNotFound: 'Specialty not found',
      specialtyNotFoundDesc: 'It may have been removed or does not exist.',
      playlist: 'Playlist',
      continuousLearning: 'continuous learning',
      chapters: 'Chapters',
      showMore: 'Show more',
      showLess: 'Show less',
      published: 'Published',
      notesPdf: 'Notes (PDF)',
      copiedToClipboard: 'Lecture link copied to clipboard',
    },
    saved: {
      title: 'Saved Resources',
      subtitle: 'Quick access to your bookmarked video lectures, reading documents and watch history.',
      videosTab: 'Video Lectures',
      documentsTab: 'Documents',
      historyTab: 'Watch History',
      clearHistory: 'Clear History',
      noSavedVideos: 'No saved videos yet',
      noSavedVideosDesc: 'Click the bookmark icon on any video lecture to keep it here for quick revision.',
      noSavedDocs: 'No saved documents yet',
      noSavedDocsDesc: 'Bookmark lecture notes, TD exercise sheets and past exams to access them anytime.',
      noHistory: 'No watch history recorded',
      noHistoryDesc: 'Lectures you watch will appear here automatically so you can resume where you left off.',
      removeBookmark: 'Remove bookmark',
      resume: 'Resume',
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'Earlier this week',
      older: 'Older',
      openDoc: 'Open Document',
      browseCatalog: 'Browse catalog',
    },
    support: {
      title: 'Technical Support',
      subtitle: 'Submit assistance requests to the faculty e-learning staff or find quick answers to common platform issues.',
      submitTicket: 'Submit a Ticket',
      issueType: 'Issue Type',
      subject: 'Subject',
      subjectPlaceholder: 'Brief description of the problem…',
      description: 'Detailed Description',
      descriptionPlaceholder: 'Include your study year, device, browser, and what happened…',
      attachment: 'Attachment (Screenshot or error file)',
      sendTicket: 'Send Ticket',
      sending: 'Submitting ticket…',
      recentTickets: 'Your Recent Tickets',
      faq: 'Frequently Asked Questions',
      ticketSentSuccess: 'Support ticket submitted successfully! Our technical team will review it.',
      ticketCode: 'Ticket Code',
      statusOpen: 'Open',
      statusInProgress: 'In Progress',
      statusResolved: 'Resolved',
      issueTypes: {
        video: 'Video playback',
        document: 'Document access',
        account: 'Account & login',
        upload: 'Upload problem',
        network: 'Connectivity',
        other: 'Other issue',
      },
    },
    auth: {
      signIn: 'Sign In',
      createAccount: 'Create Account',
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g. John Doe',
      email: 'Email Address',
      emailPlaceholder: 'your.email@university.edu',
      password: 'Password',
      faculty: 'Faculty / Department',
      facultyPlaceholder: 'e.g. Faculty of Human Sciences',
      testAccounts: 'One-Click Test Accounts',
      authenticating: 'Authenticating...',
      signInButton: 'Sign In to Portal',
      createButton: 'Create & Access Portal',
      noAccount: "Don't have an account yet?",
      haveAccount: 'Already registered?',
      createOneNow: 'Create one now',
      signInHere: 'Sign in here',
      instructorTest: 'Instructor',
      studentTest: 'Student',
    },
    modals: {
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this?',
      cannotBeUndone: 'This action cannot be undone and will permanently remove associated data.',
      addYearTitle: 'Add Academic Year',
      editYearTitle: 'Edit Academic Year',
      deleteYearTitle: 'Delete Academic Year',
      addSpecialtyTitle: 'Add Specialty',
      editSpecialtyTitle: 'Edit Specialty',
      deleteSpecialtyTitle: 'Delete Specialty',
      addSectionTitle: 'Add New Section',
      editSectionTitle: 'Edit Section',
      deleteSectionTitle: 'Delete Section',
      addLectureTitle: 'Add New Lecture or Document',
      editLectureTitle: 'Edit Lecture Information',
      deleteLectureTitle: 'Delete Lecture',
      yearName: 'Year Name (e.g. Licence 1)',
      yearCode: 'Year Code (e.g. L1)',
      yearTagline: 'Tagline / Academic Description',
      specialtyName: 'Specialty Name',
      specialtyCode: 'Specialty Code (e.g. PSY)',
      specialtyFaculty: 'Faculty / Department',
      specialtyDesc: 'Description',
      sectionName: 'Section Name (e.g. Cours, TD, Exam, Lab)',
      sectionDisplayMode: 'Display Mode',
      lectureTitle: 'Lecture Title',
      lectureDesc: 'Description & Summary',
      lectureModule: 'Module / Course Unit',
      lectureInstructor: 'Instructor Name',
      lectureFormat: 'Format',
      lectureDuration: 'Duration (Minutes)',
      lecturePages: 'Number of Pages',
      lectureFile: 'Lecture File',
      uploadFile: 'Upload File',
      dragAndDrop: 'Drag and drop or browse video/document to upload',
      createYear: 'Create year',
      updateYear: 'Update year',
      createSpecialty: 'Create specialty',
      updateSpecialty: 'Update specialty',
      createSection: 'Create section',
      updateSection: 'Update section',
      createLecture: 'Publish resource',
      updateLecture: 'Update resource',
      addYearSubtitle: 'Create a new level that specialties can be attached to.',
      editYearSubtitle: 'Modify academic year properties.',
      deleteYearWarning: 'This will permanently delete this academic year and all associated specialties and lectures.',
      addSpecialtySubtitle: 'Attach a new discipline with its custom sections.',
      editSpecialtySubtitle: 'Update discipline title, faculty and branding.',
      deleteSpecialtyWarning: 'This will delete this specialty and all its dynamic sections and lectures.',
      addSectionSubtitle: 'Create a dynamic category like Cours, TD, Exam, or Labs.',
      editSectionSubtitle: 'Update section details and category.',
      deleteSectionWarning: 'This will delete this section and all lectures inside it.',
      addLectureSubtitle: 'Upload and publish videos or documents for students.',
      editLectureSubtitle: 'Update resource title, module and instructor.',
      deleteLectureWarning: 'Are you sure you want to delete this lecture? This cannot be undone.',
      chooseIcon: 'Choose an icon',
      chooseCover: 'Or pick a cover image',
      selectYear: 'Academic Year',
      selectSpecialty: 'Specialty / Discipline',
      selectSection: 'Target Section',
      browseFile: 'Click to browse file',
      formatsAllowed: 'MP4, PDF, DOCX up to 500MB',
    },
    landing: {
      heroBadge: 'New · Spring 2025 exam archive is live',
      heroTitle: 'Every lecture, TD and past exam —',
      heroHighlight: 'in one place.',
      heroSubtitle: "Psylume is your university's lecture hub. Watch recorded courses, work through directed exercises, read past papers in the built-in reader and keep everything you need for revision in one saved list.",
      enterPlatform: 'Enter Platform / Sign In',
      exploreCatalog: 'Explore Catalog',
      features: 'Features',
      platform: 'Platform',
      forFaculty: 'For Faculty',
      goToDashboard: 'Go to Dashboard',
      seeHowItWorks: 'See how it works',
      studentsActive: 'students active on the platform right now',
      liveCapture: 'Live Capture',
      sampleLectureTitle: 'Working Memory Models & Cognitive Load',
      academicYearsLabel: 'Academic Years',
      disciplinesLabel: 'Disciplines',
      resourcesLabel: 'Resources',
      statEnrolled: 'Enrolled students across faculties',
      statVideos: 'Video lecture recordings',
      statResources: 'Total catalogued resources',
      statSatisfaction: 'Course satisfaction rate',
      whatsInside: "What's inside",
      featuresH2: 'Built around how a semester',
      featuresH2Highlight: 'actually works.',
      feature1Title: 'Video lecture player',
      feature1Body: 'Chapters, timeline scrubbing, playback speed from 0.5× to 2× and captions. Picks up exactly where you left off.',
      feature2Title: 'Structured Dynamic Sections',
      feature2Body: 'Year → Specialty → Sections. Cours, TD, Exam, and custom faculty labs live exactly where you expect them.',
      itemsCount: 'items',
      feature3Title: 'Integrated document reader',
      feature3Body: 'Open PDFs and DOCX files right next to the playlist. Zoom, paginate and download without leaving the page.',
      feature4Title: 'Student bookmarking & history',
      feature4Body: 'Save videos and documents into a personal revision list, with watch history so nothing gets lost.',
      facultyTag: 'Supervisor Instructors',
      facultyH2: 'Publish a lecture in under a minute.',
      facultyDesc: 'Faculty accounts unlock contextual management actions across the platform — create academic years, open new specialties, add custom sections, and upload MP4, PDF or DOCX materials with Supabase storage.',
      facultyPoint1: 'Drag-and-drop uploads with automatic format recognition',
      facultyPoint2: 'Custom sections beyond standard Cours, TD, and Exam',
      facultyPoint3: 'Full Edit and Delete management capabilities with cascade protection',
      enterAsFaculty: 'Enter as faculty',
      ctaH2: 'academic years. {specialties} disciplines.',
      oneHub: 'One hub.',
      copyright: '© 2025 Psylume — University Lecture Hub',
      footerLinks: 'Accessibility · Privacy · Academic integrity charter',
      studentsEnrolled: 'Students Enrolled',
      videoLecturesCount: 'Video Lectures',
      academicYearsCount: 'Academic Years',
      activeFaculty: 'Active Faculty Staff',
      featuresTitle: 'Built for Academic Excellence',
      featuresSubtitle: 'Everything students and instructors need to learn, teach, and revise effectively.',
      feature1Desc: 'Stream lecture recordings with playback speed control, bookmarking and progress tracking.',
      feature2Desc: 'Read course handouts, TD sheets and past exams directly in-browser with zoom and search.',
      feature3Desc: 'Instructors can upload files, create custom sections, and manage curriculum effortlessly.',
      ctaTitle: 'Ready to elevate your university studies?',
      ctaSubtitle: 'Access course materials anytime, anywhere from any device.',
      ctaButton: 'Get Started Now',
    },
    player: {
      part: 'Part',
      lectureCapture: 'Psylume University · Lecture capture',
      upNext: 'Up next in',
      upNextIn: 'Up next in',
      playNow: 'Play now',
      lectureComplete: 'Lecture complete',
      progressSaved: 'Your progress has been saved to Watch History.',
      replay: 'Replay from start',
      pdfDocument: 'PDF Document',
      studyNotes: 'Study Notes',
      previousPage: 'Previous page',
      nextPage: 'Next page',
      pageOf: 'of',
      pages: 'pages',
      speed: 'Playback speed',
      quality: 'Quality',
      fullscreen: 'Fullscreen (f)',
      exitFullscreen: 'Exit fullscreen (f)',
      play: 'Play (k)',
      pause: 'Pause (k)',
      nextLecture: 'Next lecture',
      nextItem: 'Next item',
      unmute: 'Unmute (m)',
      mute: 'Mute (m)',
      captions: 'Captions (c)',
      settings: 'Settings',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      fitWidth: 'Fit to width',
      resetZoom: 'Reset',
      downloadFile: 'Download file',
      downloadOriginal: 'Download original file from cloud storage',
      page: 'Page',
      of: 'of',
    },
  },
  ar: {
    common: {
      appName: 'Psylume',
      tagline: 'المنصة الجامعية للمحاضرات',
      loading: 'جارٍ تحميل الموارد الأكاديمية…',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      add: 'إضافة',
      back: 'رجوع',
      close: 'إغلاق',
      confirm: 'تأكيد',
      search: 'بحث',
      all: 'الكل',
      views: 'مشاهدة',
      students: 'طالب',
      resources: 'مورد',
      duration: 'المدة',
      pages: 'صفحة',
      format: 'الصيغة',
      date: 'التاريخ',
      category: 'القسم',
      instructor: 'الأستاذ',
      module: 'المقياس',
      faculty: 'الكلية',
      new: 'جديد',
      completed: 'مكتمل',
      download: 'تحميل الملف',
      bookmark: 'حفظ',
      remove: 'إزالة',
      share: 'مشاركة',
    },
    nav: {
      home: 'الرئيسية',
      lectures: 'المحاضرات',
      years: 'السنوات الدراسية',
      saved: 'المحفوظات',
      support: 'الدعم الفني',
      menu: 'القائمة',
      springSemester: 'السداسي الثاني (الربيعي) 2025',
      examPeriodInfo: 'تبدأ فترة الامتحانات يوم 2 جوان. النماذج السابقة متوفرة في تبويب الامتحانات لكل تخصص.',
      viewLandingPage: 'الصفحة التعريفية',
      signIn: 'تسجيل الدخول',
      signOut: 'تسجيل الخروج',
      accountAndMode: 'الحساب والوضع',
      activeMode: 'الوضع الحالي:',
      instructorCrud: 'أستاذ مشرف (إدارة كاملة)',
      studentView: 'وضع الطالب (عرض)',
      viewAs: 'عرض بصفتك',
      student: 'طالب',
      instructor: 'أستاذ مشرف',
      admin: 'مدير النظام',
      studentTitle: 'طالب',
      instructorTitle: 'أستاذ مشرف',
      adminTitle: 'مدير النظام',
    },
    header: {
      searchPlaceholder: 'ابحث عن المحاضرات، الأعمال الموجهة، الامتحانات، الأساتذة…',
      notifications: 'الإشعارات',
      newInSpecialties: 'جديد في تخصصاتك',
      signInRegister: 'تسجيل الدخول / إنشاء حساب',
      switchedToInstructor: 'تم التبديل إلى وضع الأستاذ المشرف (صلاحيات كاملة)',
      switchedToStudent: 'تم التبديل إلى وضع الطالب (عرض فقط)',
      breadcrumbs: {
        home: 'الرئيسية',
        lectures: 'المحاضرات',
        saved: 'المحفوظات',
        support: 'الدعم الفني',
        dashboard: 'لوحة التحكم',
        year: 'السنة الدراسية',
        specialty: 'التخصص',
      },
    },
    home: {
      goodMorning: 'صباح الخير',
      goodAfternoon: 'مساء الخير',
      goodEvening: 'مساء الخير',
      publishedResourcesInstructor: 'نشرت كليتك {count} موارد جديدة هذا الأسبوع.',
      publishedResourcesStudent: 'تمت إضافة {count} موارد جديدة في تخصصاتك هذا الأسبوع.',
      welcomeInstructor: 'مرحباً بك في بوابة إدارة المحاضرات للأساتذة والمشرفين.',
      welcomeStudent: 'مرحباً بك في بوابتك الأكاديمية للدراسة والمراجعة.',
      academicYearsTitle: 'السنوات الدراسية',
      academicYearsDesc: 'تصفح تسجيلات المحاضرات، سلاسل التمارين ونماذج الامتحانات مصنفة حسب أطوار الليسانس والماستر.',
      addYear: 'إضافة سنة دراسية',
      topSpecialtiesTitle: 'أبرز التخصصات',
      topSpecialtiesDesc: 'الأقسام الأكاديمية الأكثر تفاعلاً بحسب إجمالي مشاهدات المحاضرات.',
      addSpecialty: 'إضافة تخصص',
      recentLecturesTitle: 'أحدث المحاضرات والموارد',
      recentLecturesDesc: 'أحدث الدروس المصورة وسلاسل الأعمال الموجهة والامتحانات المنشورة عبر مختلف التخصصات.',
      addLecture: 'إضافة محاضرة',
      viewAllCatalog: 'عرض كامل الفهرس',
      resumeTitle: 'متابعة المشاهدة',
      resumeProgress: 'تم إنجاز {percent}%',
      noLecturesYet: 'لم يتم نشر أي محاضرات بعد.',
      noSpecialtiesYet: 'لا توجد تخصصات مسجلة في هذه السنة الدراسية.',
      noYearsYet: 'لم يتم إنشاء أي سنوات دراسية بعد.',
      totalStudents: 'إجمالي الطلبة المسجلين',
      totalViews: 'إجمالي المشاهدات',
    },
    lectures: {
      catalog: 'الفهرس الأكاديمي',
      allLectures: 'جميع المحاضرات',
      resourcesCount: '{filtered} من أصل {total} مورد',
      matching: 'مطابقة لـ “{query}”',
      searchPlaceholder: 'تصفية حسب العنوان، المقياس، الأستاذ…',
      allFormats: 'جميع الصيغ',
      allSpecialties: 'جميع التخصصات',
      allYears: 'جميع السنوات الدراسية',
      allCategories: 'جميع الأقسام',
      sortNewest: 'الأحدث أولاً',
      sortViews: 'الأكثر مشاهدة',
      resetFilters: 'إعادة ضبط الفلاتر',
      loadMore: 'تحميل المزيد من الموارد',
      noLecturesFound: 'لا توجد محاضرات تطابق معايير البحث',
      noLecturesDesc: 'جرّب تعديل كلمة البحث أو تصفير الفلاتر لعرض المستودع بالكامل.',
    },
    specialty: {
      faculty: 'الكلية',
      instructors: 'الأساتذة المؤطرون',
      enrolledStudents: 'الطلبة المسجلون',
      annualGrowth: 'النمو السنوي',
      curriculum: 'مقاييس المنهج',
      addSection: 'إضافة قسم جديد',
      editSpecialty: 'تعديل التخصص',
      deleteSpecialty: 'حذف التخصص',
      manageSections: 'إدارة الأقسام',
      noLecturesInSection: 'لا يوجد محتوى في هذا القسم حتى الآن',
      beFirstToUpload: 'قم برفع أول محاضرة أو وثيقة دراسية للبدء.',
      backToYear: 'العودة إلى {year}',
      sections: 'الأقسام',
      specialties: 'التخصصات',
      enrolledSpecialties: 'التخصصات المسجلة',
      step1: 'الخطوة 1 من 2',
      step2: 'الخطوة 2 من 2 · اختر قسماً',
      academicYear: 'السنة الجامعية',
      lecturesAndFiles: 'المحاضرات والملفات',
      dynamicSections: 'الأقسام الديناميكية',
      chooseSection: 'اختر قسماً',
      addCustomSection: 'إضافة قسم مخصص',
      noSectionsYet: 'لم يتم إنشاء أقسام بعد',
      noSectionsDesc: 'تنظم الأقسام الديناميكية المواد التعليمية (مثل: محاضرات نظرية، أعمال موجهة TD، امتحانات، أو مقاييس مخصصة). قم بإنشاء أول قسم لبدء نشر المحاضرات.',
      createFirstSection: '+ إنشاء أول قسم',
      addLectureOrFile: 'إضافة محاضرة / ملف',
      allFormats: 'جميع الصيغ',
      newestFirst: 'الأحدث أولاً',
      mostViewed: 'الأكثر مشاهدة',
      titleAZ: 'العنوان أ–ي',
      noLecturesUploaded: 'لم يتم رفع محاضرات أو وثائق بعد',
      noLecturesSectionDesc: 'لم يتم نشر أي محاضرات أو ملفات تعليمية في هذا القسم حتى الآن.',
      noSpecialtiesYearTitle: 'لا توجد تخصصات مسجلة في هذه السنة',
      noSpecialtiesYearDesc: 'لا ترتبط هذه السنة الدراسية بأي تخصص حتى الآن. أضف التخصص الأول لتكوين أقسامه ومحاضراته.',
      pickSpecialtyDesc: 'اختر تخصصاً لفتح أقسامه الدراسية (محاضرات، أعمال موجهة، امتحانات، مخابر) الخاصة بـ {year}.',
      yearNotFound: 'السنة الدراسية غير موجودة',
      yearNotFoundDesc: 'هذه السنة الأكاديمية غير موجودة أو تمت إزالتها.',
      specialtyNotFound: 'التخصص غير موجود',
      specialtyNotFoundDesc: 'ربما تمت إزالة هذا التخصص أو أنه غير موجود.',
      playlist: 'قائمة التشغيل',
      continuousLearning: 'التعليم المستمر',
      chapters: 'الفصول والمحاور',
      showMore: 'عرض المزيد',
      showLess: 'عرض أقل',
      published: 'تاريخ النشر',
      notesPdf: 'ملاحظات (PDF)',
      copiedToClipboard: 'تم نسخ رابط المحاضرة إلى الحافظة',
    },
    saved: {
      title: 'الموارد المحفوظة',
      subtitle: 'وصول فوري وسريع لمحاضرات الفيديو المحفوظة، ملفات القراءة، وسجل المشاهدة.',
      videosTab: 'محاضرات الفيديو',
      documentsTab: 'الوثائق والملفات',
      historyTab: 'سجل المشاهدة',
      clearHistory: 'مسح السجل',
      noSavedVideos: 'لا توجد فيديوهات محفوظة بعد',
      noSavedVideosDesc: 'اضغط على أيقونة الحفظ في أي محاضرة فيديو للرجوع إليها هنا للمراجعة السريعة.',
      noSavedDocs: 'لا توجد وثائق محفوظة بعد',
      noSavedDocsDesc: 'احفظ ملخصات الدروس وسلاسل التمارين ونماذج الامتحانات للوصول إليها في أي وقت.',
      noHistory: 'سجل المشاهدة فارغ',
      noHistoryDesc: 'المحاضرات التي تشاهدها ستظهر هنا تلقائياً لتتمكن من متابعة دراستك من حيث توقفت.',
      removeBookmark: 'إزالة من المحفوظات',
      resume: 'متابعة',
      today: 'اليوم',
      yesterday: 'أمس',
      thisWeek: 'في وقت سابق هذا الأسبوع',
      older: 'سابقاً',
      openDoc: 'فتح الوثيقة',
      browseCatalog: 'تصفح الدليل الأكاديمي',
    },
    support: {
      title: 'الدعم الفني',
      subtitle: 'أرسل طلبات المساعدة لفريق التعليم الإلكتروني بالكلية أو تصفح الإجابات السريعة للمشاكل الشائعة.',
      submitTicket: 'إرسال تذكرة مساعدة',
      issueType: 'نوع المشكلة',
      subject: 'الموضوع',
      subjectPlaceholder: 'وصف مختصر للمشكلة…',
      description: 'الوصف المفصل',
      descriptionPlaceholder: 'اذكر سنتك الدراسية، المتصفح والجهاز، وتفاصيل ما واجهته…',
      attachment: 'مرفق (لقطة شاشة أو ملف الخطأ)',
      sendTicket: 'إرسال التذكرة',
      sending: 'جارٍ إرسال التذكرة…',
      recentTickets: 'تذاكرك الأخيرة',
      faq: 'الأسئلة الشائعة',
      ticketSentSuccess: 'تم إرسال تذكرة الدعم بنجاح! سيقوم الفريق التقني بمراجعتها والرد عليك.',
      ticketCode: 'رمز التذكرة',
      statusOpen: 'قيد الانتظار',
      statusInProgress: 'قيد المعالجة',
      statusResolved: 'تم الحل',
      issueTypes: {
        video: 'تشغيل الفيديو',
        document: 'الوصول للملفات والوثائق',
        account: 'الحساب وتسجيل الدخول',
        upload: 'مشكلة في الرفع',
        network: 'الاتصال بالشبكة',
        other: 'مشكلة أخرى',
      },
    },
    auth: {
      signIn: 'تسجيل الدخول',
      createAccount: 'إنشاء حساب جديد',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'مثال: فاطمة الزهراء',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'your.name@university.edu',
      password: 'كلمة المرور',
      faculty: 'الكلية / القسم الأكاديمي',
      facultyPlaceholder: 'مثال: كلية العلوم الإنسانية والاجتماعية',
      testAccounts: 'حسابات تجريبية سريعة',
      authenticating: 'جارٍ التحقق وتأكيد الهوية...',
      signInButton: 'تسجيل الدخول إلى المنصة',
      createButton: 'إنشاء الحساب والدخول',
      noAccount: 'ليس لديك حساب بعد؟',
      haveAccount: 'لديك حساب بالفعل؟',
      createOneNow: 'أنشئ حساباً الآن',
      signInHere: 'سجل الدخول هنا',
      instructorTest: 'أستاذ مشرف',
      studentTest: 'طالب',
    },
    modals: {
      saveChanges: 'حفظ التغييرات',
      cancel: 'إلغاء',
      delete: 'حذف',
      confirmDelete: 'هل أنت متأكد من رغبتك في الحذف؟',
      cannotBeUndone: 'هذا الإجراء نهائي ولا يمكن التراجع عنه وسيتم حذف كافة الموارد المرتبطة.',
      addYearTitle: 'إضافة سنة دراسية',
      editYearTitle: 'تعديل السنة الدراسية',
      deleteYearTitle: 'حذف السنة الدراسية',
      addSpecialtyTitle: 'إضافة تخصص جديد',
      editSpecialtyTitle: 'تعديل التخصص',
      deleteSpecialtyTitle: 'حذف التخصص',
      addSectionTitle: 'إضافة قسم جديد',
      editSectionTitle: 'تعديل القسم',
      deleteSectionTitle: 'حذف القسم',
      addLectureTitle: 'إضافة محاضرة أو وثيقة جديدة',
      editLectureTitle: 'تعديل بيانات المحاضرة',
      deleteLectureTitle: 'حذف المحاضرة',
      yearName: 'اسم السنة الدراسية (مثال: ليسانس 1)',
      yearCode: 'رمز السنة (مثال: L1)',
      yearTagline: 'الوصف أو الشعار الأكاديمي',
      specialtyName: 'اسم التخصص',
      specialtyCode: 'رمز التخصص (مثال: PSY)',
      specialtyFaculty: 'الكلية / القسم',
      specialtyDesc: 'الوصف الأكاديمي',
      sectionName: 'اسم القسم (مثال: Cours، TD، Exam، TP)',
      sectionDisplayMode: 'نمط العرض',
      lectureTitle: 'عنوان المحاضرة أو الوثيقة',
      lectureDesc: 'الوصف والملخص',
      lectureModule: 'المقياس / المادة',
      lectureInstructor: 'اسم الأستاذ المحاضر',
      lectureFormat: 'الصيغة',
      lectureDuration: 'المدة (بالدقائق)',
      lecturePages: 'عدد الصفحات',
      lectureFile: 'ملف المحاضرة',
      uploadFile: 'رفع الملف',
      dragAndDrop: 'اسحب وأفلت أو تصفح لاختيار ملف الفيديو أو الوثيقة',
      createYear: 'إنشاء السنة الدراسية',
      updateYear: 'تحديث السنة',
      createSpecialty: 'إنشاء التخصص',
      updateSpecialty: 'تحديث التخصص',
      createSection: 'إنشاء القسم',
      updateSection: 'تحديث القسم',
      createLecture: 'نشر المورد',
      updateLecture: 'تحديث المورد',
      addYearSubtitle: 'إنشاء مستوى دراسي جديد يمكن ربط التخصصات به.',
      editYearSubtitle: 'تعديل بيانات السنة الدراسية.',
      deleteYearWarning: 'سيؤدي هذا إلى حذف السنة الدراسية نهائياً مع كافة التخصصات والمحاضرات المرتبطة بها.',
      addSpecialtySubtitle: 'إرفاق تخصص دراسي جديد مع أقسامه المخصصة.',
      editSpecialtySubtitle: 'تحديث اسم التخصص والكلية والهوية البصرية.',
      deleteSpecialtyWarning: 'سيؤدي هذا إلى حذف التخصص وكافة أقسامه ومحاضراته.',
      addSectionSubtitle: 'إنشاء تصنيف ديناميكي مثل المحاضرات، الأعمال الموجهة، الامتحانات، أو التطبيقات.',
      editSectionSubtitle: 'تعديل تفاصيل القسم وتصنيفه.',
      deleteSectionWarning: 'سيؤدي هذا إلى حذف هذا القسم وجميع المحاضرات الموجودة داخله.',
      addLectureSubtitle: 'رفع ونشر فيديوهات أو مستندات دراسية للطلبة.',
      editLectureSubtitle: 'تعديل عنوان المحاضرة والمقياس والأستاذ.',
      deleteLectureWarning: 'هل أنت متأكد من حذف هذه المحاضرة؟ لا يمكن التراجع عن هذا الإجراء.',
      chooseIcon: 'اختر أيقونة مناسبة',
      chooseCover: 'أو اختر صورة غلاف',
      selectYear: 'السنة الدراسية',
      selectSpecialty: 'التخصص الدراسي',
      selectSection: 'القسم المستهدف',
      browseFile: 'اضغط لاختيار الملف',
      formatsAllowed: 'يدعم صيغ MP4 و PDF و DOCX حتى 500 ميغابايت',
    },
    landing: {
      heroBadge: 'جديد · أرشيف امتحانات ربيع 2025 متوفر الآن',
      heroTitle: 'كل المحاضرات، الأعمال الموجهة ونماذج الامتحانات —',
      heroHighlight: 'في منصة واحدة.',
      heroSubtitle: 'منصة Psylume هي منصتك الجامعية المركزية. شاهد المحاضرات المصورة، أنجز سلاسل الأعمال الموجهة، طالع نماذج الامتحانات السابقة بالقارئ المدمج، واحتفظ بكل ما تحتاجه للمراجعة في قائمة واحدة.',
      enterPlatform: 'دخول المنصة / تسجيل الدخول',
      exploreCatalog: 'استكشاف الفهرس',
      features: 'المميزات',
      platform: 'عن المنصة',
      forFaculty: 'لهيئة التدريس',
      goToDashboard: 'الذهاب للوحة التحكم',
      seeHowItWorks: 'شاهد كيف يعمل',
      studentsActive: 'طالب نشط على المنصة الآن',
      liveCapture: 'بث مباشر من المدرج',
      sampleLectureTitle: 'نماذج الذاكرة العاملة والعبء المعرفي',
      academicYearsLabel: 'سنوات دراسية',
      disciplinesLabel: 'التخصصات',
      resourcesLabel: 'الموارد التعليمية',
      statEnrolled: 'الطلبة المسجلين عبر الكليات',
      statVideos: 'تسجيلات المحاضرات المصورة',
      statResources: 'إجمالي الموارد المتاحة',
      statSatisfaction: 'نسبة رضا الطلاب عن المنصة',
      whatsInside: 'محتويات المنصة',
      featuresH2: 'مصممة لتلائم سير الفصل الدراسي',
      featuresH2Highlight: 'بشكل واقعي ومتقن.',
      feature1Title: 'مشغل محاضرات الفيديو المتطور',
      feature1Body: 'فصول المحاضرة، التحكم الدقيق بالخط الزمني، سرعات تشغيل من 0.5× حتى 2×. تستأنف المحاضرة تلقائياً من حيث توقفت.',
      feature2Title: 'أقسام ديناميكية متناسقة',
      feature2Body: 'السنة → التخصص → الأقسام. المحاضرات، الأعمال الموجهة TD، نماذج الامتحانات، وأشغال المخابر TP في مكانها الطبيعي.',
      itemsCount: 'عنصر',
      feature3Title: 'قارئ المستندات والوثائق المدمج',
      feature3Body: 'تصفح ملفات PDF و DOCX مباشرة إلى جانب قائمة التشغيل. إمكانية التكبير والتنقل بين الصفحات والتحميل دون مغادرة الصفحة.',
      feature4Title: 'قائمة المحفوظات وسجل المشاهدة للطلبة',
      feature4Body: 'احفظ الفيديوهات والملخصات في قائمتك الشخصية للمراجعة، مع حفظ دقيق لسجل المشاهدة لضمان عدم ضياع أي درس.',
      facultyTag: 'الأساتذة والمشرفون',
      facultyH2: 'انشر محاضرتك أو مرجعك في أقل من دقيقة.',
      facultyDesc: 'تمنح حسابات الأساتذة صلاحيات كاملة لإدارة المنصة — إنشاء السنوات الأكاديمية، إضافة التخصصات، إنشاء أقسام جديدة ورفع ملفات الفيديو والوثائق بسلاسة عبر التخزين السحابي.',
      facultyPoint1: 'سحب وإفلات لرفع الملفات مع التعرف التلقائي على الصيغة',
      facultyPoint2: 'أقسام مخصصة تتجاوز الدروس والتمارين والامتحانات القياسية',
      facultyPoint3: 'إمكانيات تعديل وحذف كاملة مع حماية العلاقات المترابطة',
      enterAsFaculty: 'الدخول كأستاذ',
      ctaH2: 'سنوات دراسية. {specialties} تخصصاً.',
      oneHub: 'منصة مركزية واحدة.',
      copyright: '© 2025 Psylume — المنصة الجامعية للمحاضرات والتعليم الإلكتروني',
      footerLinks: 'إمكانية الوصول · الخصوصية · ميثاق النزاهة الأكاديمية',
      studentsEnrolled: 'طالب مسجل',
      videoLecturesCount: 'محاضرة مصورة',
      academicYearsCount: 'سنوات دراسية',
      activeFaculty: 'أستاذ ومؤطر نشط',
      featuresTitle: 'مصممة خصيصاً للتميز الأكاديمي',
      featuresSubtitle: 'كل ما يحتاجه الطالب والأستاذ للتعلم والتدريس والمراجعة الفعالة بأعلى جودة.',
      feature1Desc: 'مشاهدة تسجيلات المحاضرات مع التحكم في سرعة التشغيل، وحفظ الفيديوهات، ومتابعة التقدم.',
      feature2Desc: 'تصفح ملخصات المقاييس وسلاسل التمارين ونماذج الامتحانات مباشرة في المتصفح مع إمكانية التكبير والبحث.',
      feature3Desc: 'تمكين الأساتذة من رفع الملفات وإنشاء أقسام مخصصة وإدارة المناهج بسهولة وسرعة.',
      ctaTitle: 'هل أنت جاهز لتطوير مسارك الدراسي الجامعي؟',
      ctaSubtitle: 'احصل على كافة المحاضرات والمراجع في أي وقت ومن أي جهاز.',
      ctaButton: 'ابدأ الآن مجاناً',
    },
    player: {
      part: 'الجزء',
      lectureCapture: 'جامعة Psylume · تسجيل المحاضرات',
      upNext: 'المحاضرة التالية خلال',
      upNextIn: 'المحاضرة التالية خلال',
      playNow: 'تشغيل الآن',
      lectureComplete: 'اكتملت المحاضرة',
      progressSaved: 'تم حفظ تقدمك في سجل المشاهدة بنجاح.',
      replay: 'إعادة التشغيل من البداية',
      pdfDocument: 'وثيقة PDF الأصلية',
      studyNotes: 'ملاحظات المراجعة',
      previousPage: 'الصفحة السابقة',
      nextPage: 'الصفحة التالية',
      pageOf: 'من',
      pages: 'صفحات',
      speed: 'سرعة التشغيل',
      quality: 'جودة العرض',
      fullscreen: 'ملء الشاشة (f)',
      exitFullscreen: 'الخروج من ملء الشاشة (f)',
      play: 'تشغيل (k)',
      pause: 'إيقاف مؤقت (k)',
      nextLecture: 'المحاضرة التالية',
      nextItem: 'العنصر التالي',
      unmute: 'إلغاء كتم الصوت (m)',
      mute: 'كتم الصوت (m)',
      captions: 'الترجمة والشرح (c)',
      settings: 'الإعدادات',
      zoomIn: 'تكبير',
      zoomOut: 'تصغير',
      fitWidth: 'ملاءمة العرض',
      resetZoom: 'إعادة ضبط',
      downloadFile: 'تحميل الملف',
      downloadOriginal: 'تحميل الملف الأصلي من التخزين السحابي',
      page: 'صفحة',
      of: 'من',
    },
  },
  fr: {
    common: {
      appName: 'Psylume',
      tagline: 'Portail Universitaire de Cours',
      loading: 'Chargement des ressources académiques…',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      add: 'Ajouter',
      back: 'Retour',
      close: 'Fermer',
      confirm: 'Confirmer',
      search: 'Rechercher',
      all: 'Tout',
      views: 'vues',
      students: 'étudiants',
      resources: 'ressources',
      duration: 'Durée',
      pages: 'pages',
      format: 'Format',
      date: 'Date',
      category: 'Section',
      instructor: 'Enseignant',
      module: 'Module',
      faculty: 'Faculté',
      new: 'Nouveau',
      completed: 'Terminé',
      download: 'Télécharger',
      bookmark: 'Enregistrer',
      remove: 'Retirer',
      share: 'Partager',
    },
    nav: {
      home: 'Accueil',
      lectures: 'Cours & TD',
      years: 'Années Universitaires',
      saved: 'Enregistrés',
      support: 'Support',
      menu: 'Menu',
      springSemester: 'Semestre de printemps 2025',
      examPeriodInfo: 'Période d\'examens dès le 2 juin. Annales disponibles dans l\'onglet Examens.',
      viewLandingPage: 'Page d\'accueil',
      signIn: 'Se connecter',
      signOut: 'Se déconnecter',
      accountAndMode: 'Compte & Mode',
      activeMode: 'Mode actif :',
      instructorCrud: 'Enseignant Superviseur (CRUD)',
      studentView: 'Vue Étudiant',
      viewAs: 'Afficher en tant que',
      student: 'Étudiant',
      instructor: 'Enseignant Superviseur',
      admin: 'Administrateur',
      studentTitle: 'Étudiant',
      instructorTitle: 'Enseignant Superviseur',
      adminTitle: 'Administrateur Système',
    },
    header: {
      searchPlaceholder: 'Rechercher cours, TD, examens, enseignants…',
      notifications: 'Notifications',
      newInSpecialties: 'Nouveautés dans vos spécialités',
      signInRegister: 'Connexion / Inscription',
      switchedToInstructor: 'Passage en mode Enseignant Superviseur (Gestion complète)',
      switchedToStudent: 'Passage en mode Étudiant (Consultation simple)',
      breadcrumbs: {
        home: 'Accueil',
        lectures: 'Cours',
        saved: 'Enregistrés',
        support: 'Support Technique',
        dashboard: 'Tableau de bord',
        year: 'Année Universitaire',
        specialty: 'Spécialité',
      },
    },
    home: {
      goodMorning: 'Bonjour',
      goodAfternoon: 'Bon après-midi',
      goodEvening: 'Bonsoir',
      publishedResourcesInstructor: 'Votre faculté a publié {count} nouvelles ressources cette semaine.',
      publishedResourcesStudent: '{count} nouvelles ressources ajoutées dans vos spécialités cette semaine.',
      welcomeInstructor: 'Bienvenue sur votre portail de gestion pédagogique enseignant.',
      welcomeStudent: 'Bienvenue sur votre portail d\'études et révisions universitaires.',
      academicYearsTitle: 'Années Universitaires',
      academicYearsDesc: 'Consultez les enregistrements de cours, fiches de TD et examens regroupés par année de Licence et Master.',
      addYear: 'Ajouter une année',
      topSpecialtiesTitle: 'Spécialités Populaires',
      topSpecialtiesDesc: 'Départements académiques les plus consultés classés par volume de vues.',
      addSpecialty: 'Ajouter une spécialité',
      recentLecturesTitle: 'Derniers Cours & Ressources',
      recentLecturesDesc: 'Dernières leçons vidéo, fiches d\'exercices et examens publiés dans toutes les spécialités.',
      addLecture: 'Ajouter un cours',
      viewAllCatalog: 'Voir tout le catalogue',
      resumeTitle: 'Reprendre la lecture',
      resumeProgress: '{percent}% complété',
      noLecturesYet: 'Aucun cours publié pour le moment.',
      noSpecialtiesYet: 'Aucune spécialité trouvée pour cette année.',
      noYearsYet: 'Aucune année universitaire créée.',
      totalStudents: 'Étudiants inscrits',
      totalViews: 'Vues totales',
    },
    lectures: {
      catalog: 'Catalogue Pédagogique',
      allLectures: 'Tous les Cours',
      resourcesCount: '{filtered} sur {total} ressources',
      matching: 'correspondant à « {query} »',
      searchPlaceholder: 'Filtrer par titre, module, enseignant…',
      allFormats: 'Tous les formats',
      allSpecialties: 'Toutes les spécialités',
      allYears: 'Toutes les années',
      allCategories: 'Toutes les sections',
      sortNewest: 'Plus récents',
      sortViews: 'Plus consultés',
      resetFilters: 'Réinitialiser les filtres',
      loadMore: 'Charger plus de ressources',
      noLecturesFound: 'Aucun cours ne correspond à vos critères',
      noLecturesDesc: 'Essayez d\'élargir votre recherche ou réinitialisez les filtres pour afficher tout le catalogue.',
    },
    specialty: {
      faculty: 'Faculté',
      instructors: 'Corps Enseignant',
      enrolledStudents: 'Étudiants inscrits',
      annualGrowth: 'Croissance annuelle',
      curriculum: 'Modules d\'enseignement',
      addSection: 'Ajouter une section',
      editSpecialty: 'Modifier la spécialité',
      deleteSpecialty: 'Supprimer la spécialité',
      manageSections: 'Gérer les sections',
      noLecturesInSection: 'Aucun contenu disponible dans cette section pour le moment',
      beFirstToUpload: 'Téléversez le premier cours ou document d\'étude pour débuter.',
      backToYear: 'Retour à {year}',
      sections: 'Sections',
      specialties: 'Spécialités',
      enrolledSpecialties: 'Spécialités Inscrites',
      step1: 'Étape 1 sur 2',
      step2: 'Étape 2 sur 2 · Choisir une section',
      academicYear: 'Année universitaire',
      lecturesAndFiles: 'Cours & Fichiers',
      dynamicSections: 'Sections Dynamiques',
      chooseSection: 'Choisir une section',
      addCustomSection: 'Ajouter une section personnalisée',
      noSectionsYet: 'Aucune section créée pour l\'instant',
      noSectionsDesc: 'Les sections dynamiques organisent le contenu pédagogique (ex. Cours Magistraux, TD, Examens, ou modules personnalisés). Créez la première section pour publier des cours.',
      createFirstSection: '+ Créer la première section',
      addLectureOrFile: 'Ajouter un cours / fichier',
      allFormats: 'Tous formats',
      newestFirst: 'Plus récents',
      mostViewed: 'Plus consultés',
      titleAZ: 'Titre A–Z',
      noLecturesUploaded: 'Aucun cours ou document téléversé pour le moment',
      noLecturesSectionDesc: 'Aucun cours ou fichier pédagogique n\'a encore été publié dans cette section.',
      noSpecialtiesYearTitle: 'Aucune spécialité inscrite dans cette année',
      noSpecialtiesYearDesc: 'Cette année d\'études ne comporte aucune spécialité pour l\'instant. Ajoutez la première spécialité pour configurer ses sections et cours.',
      pickSpecialtyDesc: 'Sélectionnez une spécialité pour explorer ses sections dynamiques (Cours, TD, Examens, TP) pour {year}.',
      yearNotFound: 'Année introuvable',
      yearNotFoundDesc: 'Cette année universitaire n\'existe pas ou a été supprimée.',
      specialtyNotFound: 'Spécialité introuvable',
      specialtyNotFoundDesc: 'Elle a peut-être été supprimée ou n\'existe pas.',
      playlist: 'Liste de lecture',
      continuousLearning: 'apprentissage continu',
      chapters: 'Chapitres',
      showMore: 'Afficher plus',
      showLess: 'Afficher moins',
      published: 'Date de publication',
      notesPdf: 'Notes (PDF)',
      copiedToClipboard: 'Lien du cours copié dans le presse-papiers',
    },
    saved: {
      title: 'Ressources Enregistrées',
      subtitle: 'Accès rapide à vos cours vidéo mis en favoris, documents de lecture et historique.',
      videosTab: 'Cours Vidéo',
      documentsTab: 'Documents',
      historyTab: 'Historique',
      clearHistory: 'Effacer l\'historique',
      noSavedVideos: 'Aucune vidéo enregistrée',
      noSavedVideosDesc: 'Cliquez sur l\'icône de favori d\'un cours vidéo pour le retrouver facilement ici.',
      noSavedDocs: 'Aucun document enregistré',
      noSavedDocsDesc: 'Enregistrez vos fiches de cours, TD et annales pour y accéder à tout moment.',
      noHistory: 'Historique de visionnage vide',
      noHistoryDesc: 'Les cours que vous consultez s\'afficheront ici pour vous permettre de reprendre là où vous vous étiez arrêté.',
      removeBookmark: 'Retirer des favoris',
      resume: 'Reprendre',
      today: "Aujourd'hui",
      yesterday: 'Hier',
      thisWeek: 'Plus tôt cette semaine',
      older: 'Plus ancien',
      openDoc: 'Ouvrir le document',
      browseCatalog: 'Parcourir le catalogue',
    },
    support: {
      title: 'Support Technique',
      subtitle: 'Envoyez vos demandes d\'assistance à l\'équipe e-learning ou consultez les réponses aux questions fréquentes.',
      submitTicket: 'Soumettre un ticket',
      issueType: 'Type de problème',
      subject: 'Objet',
      subjectPlaceholder: 'Courte description du problème…',
      description: 'Description détaillée',
      descriptionPlaceholder: 'Précisez votre année d\'étude, appareil, navigateur et ce qui s\'est produit…',
      attachment: 'Pièce jointe (Capture d\'écran ou fichier d\'erreur)',
      sendTicket: 'Envoyer le ticket',
      sending: 'Envoi du ticket en cours…',
      recentTickets: 'Vos tickets récents',
      faq: 'Foire Aux Questions (FAQ)',
      ticketSentSuccess: 'Ticket de support envoyé avec succès ! Notre équipe technique l\'examinera sous peu.',
      ticketCode: 'Code du ticket',
      statusOpen: 'Ouvert',
      statusInProgress: 'En cours',
      statusResolved: 'Résolu',
      issueTypes: {
        video: 'Lecture vidéo',
        document: 'Accès aux documents',
        account: 'Compte & connexion',
        upload: 'Problème de téléversement',
        network: 'Connectivité réseau',
        other: 'Autre question',
      },
    },
    auth: {
      signIn: 'Se connecter',
      createAccount: 'Créer un compte',
      fullName: 'Nom complet',
      fullNamePlaceholder: 'ex. Sarah Mansouri',
      email: 'Adresse e-mail',
      emailPlaceholder: 'votre.email@universite.edu',
      password: 'Mot de passe',
      faculty: 'Faculté / Département',
      facultyPlaceholder: 'ex. Faculté des Sciences Humaines',
      testAccounts: 'Comptes de test en un clic',
      authenticating: 'Vérification en cours...',
      signInButton: 'Accéder au portail',
      createButton: 'Créer le compte et accéder',
      noAccount: 'Pas encore de compte ?',
      haveAccount: 'Déjà inscrit ?',
      createOneNow: 'Créer un compte',
      signInHere: 'Connectez-vous ici',
      instructorTest: 'Enseignant',
      studentTest: 'Étudiant',
    },
    modals: {
      saveChanges: 'Enregistrer les modifications',
      cancel: 'Annuler',
      delete: 'Supprimer',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
      cannotBeUndone: 'Cette action est irréversible et supprimera définitivement les données associées.',
      addYearTitle: 'Ajouter une Année Universitaire',
      editYearTitle: 'Modifier l\'Année Universitaire',
      deleteYearTitle: 'Supprimer l\'Année Universitaire',
      addSpecialtyTitle: 'Ajouter une Spécialité',
      editSpecialtyTitle: 'Modifier la Spécialité',
      deleteSpecialtyTitle: 'Supprimer la Spécialité',
      addSectionTitle: 'Ajouter une Section',
      editSectionTitle: 'Modifier la Section',
      deleteSectionTitle: 'Supprimer la Section',
      addLectureTitle: 'Ajouter un Cours ou Document',
      editLectureTitle: 'Modifier les Informations du Cours',
      deleteLectureTitle: 'Supprimer le Cours',
      yearName: 'Nom de l\'année (ex. Licence 1)',
      yearCode: 'Code (ex. L1)',
      yearTagline: 'Description académique',
      specialtyName: 'Nom de la spécialité',
      specialtyCode: 'Code spécialité (ex. PSY)',
      specialtyFaculty: 'Faculté / Département',
      specialtyDesc: 'Description académique',
      sectionName: 'Nom de la section (ex. Cours, TD, Examens, TP)',
      sectionDisplayMode: 'Mode d\'affichage',
      lectureTitle: 'Titre du cours ou document',
      lectureDesc: 'Description & résumé',
      lectureModule: 'Module / Unité d\'enseignement',
      lectureInstructor: 'Nom de l\'enseignant',
      lectureFormat: 'Format',
      lectureDuration: 'Durée (Minutes)',
      lecturePages: 'Nombre de pages',
      lectureFile: 'Fichier du cours',
      uploadFile: 'Téléverser le fichier',
      dragAndDrop: 'Glissez-déposez ou parcourez pour téléverser votre fichier vidéo ou document',
      createYear: 'Créer l\'année',
      updateYear: 'Mettre à jour l\'année',
      createSpecialty: 'Créer la spécialité',
      updateSpecialty: 'Mettre à jour la spécialité',
      createSection: 'Créer la section',
      updateSection: 'Mettre à jour la section',
      createLecture: 'Publier la ressource',
      updateLecture: 'Mettre à jour la ressource',
      addYearSubtitle: 'Créer un nouveau niveau d\'études auquel rattacher des spécialités.',
      editYearSubtitle: 'Modifier les informations de l\'année universitaire.',
      deleteYearWarning: 'Ceci supprimera définitivement cette année ainsi que toutes les filières et cours associés.',
      addSpecialtySubtitle: 'Associer une nouvelle discipline avec ses sections personnalisées.',
      editSpecialtySubtitle: 'Mettre à jour l\'intitulé, la faculté et l\'identité de la spécialité.',
      deleteSpecialtyWarning: 'Ceci supprimera cette filière et toutes ses sections et cours.',
      addSectionSubtitle: 'Créer une catégorie comme Cours, TD, Examens ou TP.',
      editSectionSubtitle: 'Modifier les détails et la catégorie de la section.',
      deleteSectionWarning: 'Ceci supprimera cette section et tous les cours qu\'elle contient.',
      addLectureSubtitle: 'Téléverser et publier des vidéos ou documents pour les étudiants.',
      editLectureSubtitle: 'Mettre à jour le titre, module et enseignant du cours.',
      deleteLectureWarning: 'Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.',
      chooseIcon: 'Choisir une icône',
      chooseCover: 'Ou choisir une image de couverture',
      selectYear: 'Année Universitaire',
      selectSpecialty: 'Spécialité / Filière',
      selectSection: 'Section Ciblée',
      browseFile: 'Cliquez pour parcourir un fichier',
      formatsAllowed: 'MP4, PDF, DOCX jusqu\'à 500 Mo',
    },
    landing: {
      heroBadge: 'Nouveau · L\'archive des examens du printemps 2025 est en ligne',
      heroTitle: 'Tous les cours, TD et annales d\'examens —',
      heroHighlight: 'en un seul endroit.',
      heroSubtitle: 'Psylume est le portail universitaire de référence. Visionnez vos cours magistraux, travaillez vos séries d\'exercices dirigés, consultez les annales avec le lecteur intégré et rassemblez vos révisions en un seul endroit.',
      enterPlatform: 'Accéder à la plateforme / Connexion',
      exploreCatalog: 'Explorer le catalogue',
      features: 'Fonctionnalités',
      platform: 'Plateforme',
      forFaculty: 'Enseignants',
      goToDashboard: 'Tableau de bord',
      seeHowItWorks: 'Voir comment ça marche',
      studentsActive: 'étudiants actifs sur la plateforme en ce moment',
      liveCapture: 'Capture en direct',
      sampleLectureTitle: 'Modèles de Mémoire de Travail et Charge Cognitive',
      academicYearsLabel: 'Années d\'Études',
      disciplinesLabel: 'Filières',
      resourcesLabel: 'Ressources',
      statEnrolled: 'Étudiants inscrits dans les facultés',
      statVideos: 'Enregistrements vidéo de cours',
      statResources: 'Ressources pédagogiques cataloguées',
      statSatisfaction: 'Taux de satisfaction des cours',
      whatsInside: 'Au programme',
      featuresH2: 'Conçu selon le déroulement réel',
      featuresH2Highlight: 'd\'un semestre universitaire.',
      feature1Title: 'Lecteur vidéo interactif',
      feature1Body: 'Chapitrage, navigation temporelle précise, vitesse de lecture de 0.5× à 2× et sous-titres. Reprenez exactement où vous vous êtes arrêté.',
      feature2Title: 'Sections dynamiques structurées',
      feature2Body: 'Année → Spécialité → Sections. Cours magistraux, TD, Examens et TP organisés avec clarté.',
      itemsCount: 'éléments',
      feature3Title: 'Lecteur de documents intégré',
      feature3Body: 'Ouvrez les PDF et DOCX directement à côté de la liste de lecture. Zoomez, feuilletez et téléchargez sans quitter la page.',
      feature4Title: 'Favoris et historique de révision',
      feature4Body: 'Sauvegardez vidéos et fiches de cours dans votre espace personnel avec un historique complet pour ne rien perdre.',
      facultyTag: 'Enseignants & Superviseurs',
      facultyH2: 'Publiez un cours en moins d\'une minute.',
      facultyDesc: 'Les comptes enseignants bénéficient de privilèges de gestion complets : création de promotions, ouverture de spécialités, ajout de sections personnalisées et téléversement de supports variés.',
      facultyPoint1: 'Téléversement par glisser-déposer avec reconnaissance automatique du format',
      facultyPoint2: 'Sections sur mesure au-delà des Cours, TD et Examens classiques',
      facultyPoint3: 'Modification et suppression intégrale avec protection d\'intégrité',
      enterAsFaculty: 'Accéder en tant qu\'enseignant',
      ctaH2: 'années d\'études. {specialties} disciplines.',
      oneHub: 'Une plateforme unique.',
      copyright: '© 2025 Psylume — Plateforme Universitaire de Cours',
      footerLinks: 'Accessibilité · Confidentialité · Charte d\'intégrité académique',
      studentsEnrolled: 'Étudiants Inscrits',
      videoLecturesCount: 'Cours Vidéo',
      academicYearsCount: 'Années d\'Études',
      activeFaculty: 'Enseignants Actifs',
      featuresTitle: 'Conçu pour l\'Excellence Académique',
      featuresSubtitle: 'Tout ce dont les étudiants et enseignants ont besoin pour apprendre, enseigner et réviser avec efficacité.',
      feature1Desc: 'Visionnez les cours enregistrés avec contrôle de vitesse, mise en favoris et suivi d\'avancement.',
      feature2Desc: 'Consultez les supports de cours, fiches de TD et examens directement dans le navigateur.',
      feature3Desc: 'Les enseignants peuvent publier des cours, créer des sections personnalisées et organiser le cursus.',
      ctaTitle: 'Prêt à réussir votre année universitaire ?',
      ctaSubtitle: 'Accédez à l\'ensemble des ressources pédagogiques n\'importe où et sur tout appareil.',
      ctaButton: 'Commencer dès maintenant',
    },
    player: {
      part: 'Partie',
      lectureCapture: 'Université Psylume · Enregistrement de cours',
      upNext: 'Prochain cours dans',
      upNextIn: 'Prochain cours dans',
      playNow: 'Lire maintenant',
      lectureComplete: 'Cours terminé',
      progressSaved: 'Votre progression a été enregistrée dans l\'historique.',
      replay: 'Recommencer du début',
      pdfDocument: 'Document PDF',
      studyNotes: 'Notes de cours',
      previousPage: 'Page précédente',
      nextPage: 'Page suivante',
      pageOf: 'sur',
      pages: 'pages',
      speed: 'Vitesse de lecture',
      quality: 'Qualité',
      fullscreen: 'Plein écran (f)',
      exitFullscreen: 'Quitter le plein écran (f)',
      play: 'Lecture (k)',
      pause: 'Pause (k)',
      nextLecture: 'Cours suivant',
      nextItem: 'Élément suivant',
      unmute: 'Réactiver le son (m)',
      mute: 'Couper le son (m)',
      captions: 'Sous-titres (c)',
      settings: 'Paramètres',
      zoomIn: 'Zoom avant',
      zoomOut: 'Zoom arrière',
      fitWidth: 'Ajuster à la largeur',
      resetZoom: 'Réinitialiser',
      downloadFile: 'Télécharger le fichier',
      downloadOriginal: 'Télécharger le fichier original du stockage cloud',
      page: 'Page',
      of: 'sur',
    },
  },
}
