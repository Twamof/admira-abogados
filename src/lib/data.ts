// ---- Types ----
export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  content: string;
  contentAr: string;
  category: string;
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  author: string;
}

export interface Service {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  price?: string;
  active: boolean;
}

// ---- Mock Data Store ----
let appointments: Appointment[] = [
  {
    id: "apt-001",
    clientName: "Mohamed El Amrani",
    clientEmail: "m.elamrani@gmail.com",
    clientPhone: "+34 612 345 678",
    serviceType: "Derecho de Familia",
    date: "2026-03-28",
    time: "10:00",
    status: "confirmed",
    notes: "Divorcio express sin hijos",
    createdAt: "2026-03-20T09:00:00Z",
  },
  {
    id: "apt-002",
    clientName: "Fatima Benali",
    clientEmail: "f.benali@hotmail.com",
    clientPhone: "+34 698 234 567",
    serviceType: "Extranjería",
    date: "2026-03-28",
    time: "11:30",
    status: "pending",
    notes: "Renovación de tarjeta de residencia",
    createdAt: "2026-03-21T14:30:00Z",
  },
  {
    id: "apt-003",
    clientName: "Ahmed Karimi",
    clientEmail: "a.karimi@yahoo.com",
    clientPhone: "+34 677 890 123",
    serviceType: "Derecho Laboral",
    date: "2026-03-29",
    time: "09:00",
    status: "confirmed",
    notes: "Despido improcedente",
    createdAt: "2026-03-22T10:15:00Z",
  },
  {
    id: "apt-004",
    clientName: "Youssef Tazi",
    clientEmail: "y.tazi@gmail.com",
    clientPhone: "+34 654 321 987",
    serviceType: "Derecho Mercantil",
    date: "2026-03-30",
    time: "16:00",
    status: "cancelled",
    notes: "Constitución de sociedad",
    createdAt: "2026-03-22T16:00:00Z",
  },
  {
    id: "apt-005",
    clientName: "Khadija Moussa",
    clientEmail: "k.moussa@gmail.com",
    clientPhone: "+34 611 222 333",
    serviceType: "Derecho Penal",
    date: "2026-04-01",
    time: "12:00",
    status: "pending",
    notes: "Consulta urgente",
    createdAt: "2026-03-23T08:00:00Z",
  },
];

let articles: Article[] = [
  {
    id: "art-001",
    title: "Express Divorce in Spain: Everything You Need to Know",
    titleAr: "الطلاق السريع في إسبانيا: كل ما تحتاج معرفته",
    summary:
      "A complete guide to the express divorce process in Spain, timelines, and legal requirements.",
    summaryAr:
      "دليل شامل لإجراءات الطلاق السريع في إسبانيا، الجداول الزمنية والمتطلبات القانونية.",
    content: `Express divorce (Divorcio Express) in Spain can be completed in as little as 3 months when both parties agree. The process requires a mutual agreement, a legal separation period of at least 3 months from marriage, and proper legal representation.\n\nKey steps include:\n1. Filing the divorce petition\n2. Agreement on child custody (if applicable)\n3. Division of matrimonial assets\n4. Court approval\n\nAt Admira Abogados, we handle all three types of divorce situations: with children, with financial settlements, or simple mutual consent divorces.`,
    contentAr: `يمكن إتمام الطلاق السريع في إسبانيا خلال 3 أشهر عندما يتفق الطرفان. تتطلب العملية اتفاقاً متبادلاً، وفترة فصل قانونية لا تقل عن 3 أشهر من الزواج، وتمثيل قانوني مناسب.\n\nالخطوات الرئيسية:\n1. تقديم طلب الطلاق\n2. الاتفاق على حضانة الأطفال (إن وجدوا)\n3. تقسيم الأصول الزوجية\n4. موافقة المحكمة\n\nفي أدميرا أبوجادوس، نتعامل مع جميع حالات الطلاق الثلاث: مع الأطفال، مع تسويات مالية، أو طلاق بالتراضي البسيط.`,
    category: "Derecho de Familia",
    imageUrl: "/art-family.png",
    published: true,
    createdAt: "2026-03-10T10:00:00Z",
    author: "Aziza Maghni",
  },
  {
    id: "art-002",
    title: "Your Rights as a Foreign Worker in Spain",
    titleAr: "حقوقك كعامل أجنبي في إسبانيا",
    summary:
      "Understanding labor rights, work permits, and protections for immigrants in Spain.",
    summaryAr:
      "فهم حقوق العمل وتصاريح العمل والحماية للمهاجرين في إسبانيا.",
    content: `As a foreign worker in Spain, you have the same labor rights as Spanish nationals under the Workers' Statute (Estatuto de los Trabajadores). These include:\n\n- Right to fair wages\n- Protection against wrongful dismissal\n- Social security benefits\n- Safe working conditions\n- Non-discrimination rights\n\nWork permits (Autorización de Trabajo) must be renewed before expiry. Failure to renew can result in irregular status. Our office specializes in regularization procedures and work permit renewals for the Arab and Moroccan community.`,
    contentAr: `بصفتك عاملاً أجنبياً في إسبانيا، تتمتع بنفس حقوق العمل التي يتمتع بها المواطنون الإسبان بموجب نظام العمال. وتشمل:\n\n- الحق في أجور عادلة\n- الحماية من الفصل التعسفي\n- مزايا الضمان الاجتماعي\n- ظروف عمل آمنة\n- حقوق عدم التمييز\n\nيجب تجديد تصاريح العمل قبل انتهائها. يمكن أن يؤدي عدم التجديد إلى وضع غير نظامي. مكتبنا متخصص في إجراءات التسوية وتجديد تصاريح العمل للجالية العربية والمغربية.`,
    category: "Derecho Laboral",
    imageUrl: "/art-labor.png",
    published: true,
    createdAt: "2026-03-15T08:30:00Z",
    author: "Aziza Maghni",
  },
  {
    id: "art-003",
    title: "How to Recover Banking Debts: The Deuda Express Service",
    titleAr: "كيفية استرداد الديون المصرفية: خدمة ديودا إكسبريس",
    summary:
      "Step-by-step guide to recovering financial debts through legal channels in Spain.",
    summaryAr: "دليل خطوة بخطوة لاسترداد الديون المالية عبر القنوات القانونية في إسبانيا.",
    content: `Our Deuda Express service provides a fast and efficient solution for recovering banking and commercial debts. The process includes:\n\n1. FREE initial consultation to evaluate your case\n2. Formal demand letter (Burofax)\n3. Judicial order for payment (Juicio Monitorio)\n4. Enforcement proceedings if necessary\n\nWe have successfully recovered debts ranging from €500 to over €500,000. Our fee is contingency-based, meaning you only pay when we win.`,
    contentAr: `توفر خدمة ديودا إكسبريس لدينا حلاً سريعاً وفعالاً لاسترداد الديون المصرفية والتجارية. وتشمل العملية:\n\n1. استشارة أولية مجانية لتقييم قضيتك\n2. خطاب مطالبة رسمي\n3. أمر قضائي بالدفع\n4. إجراءات التنفيذ إذا لزم الأمر\n\nنجحنا في استرداد ديون تتراوح بين 500 يورو وأكثر من 500,000 يورو. رسومنا مبنية على النجاح، مما يعني أنك تدفع فقط عند الفوز.`,
    category: "Derecho Bancario",
    imageUrl: "/art-banking.png",
    published: true,
    createdAt: "2026-03-18T14:00:00Z",
    author: "Aziza Maghni",
  },
];

let services: Service[] = [
  {
    id: "svc-001",
    name: "Commercial Law",
    nameAr: "القانون التجاري",
    description: "Company registration from €25/month at Puerta del Sol",
    descriptionAr: "تسجيل الشركات من 25 يورو/شهر في بويرتا ديل سول",
    icon: "Briefcase",
    price: "Desde €25/mes",
    active: true,
  },
  {
    id: "svc-002",
    name: "Banking Law",
    nameAr: "القانون المصرفي",
    description: "Debt recovery via Deuda Express service",
    descriptionAr: "استرداد الديون عبر خدمة ديودا إكسبريس",
    icon: "CreditCard",
    price: "Sin coste inicial",
    active: true,
  },
  {
    id: "svc-003",
    name: "Labor Law",
    nameAr: "قانون العمل",
    description: "Defense in wrongful dismissal cases",
    descriptionAr: "الدفاع في قضايا الفصل التعسفي",
    icon: "Users",
    price: "Consulta gratuita",
    active: true,
  },
  {
    id: "svc-004",
    name: "Family Law",
    nameAr: "قانون الأسرة",
    description: "Express divorce, custody, and family matters",
    descriptionAr: "الطلاق السريع والحضانة وشؤون الأسرة",
    icon: "Heart",
    price: "Desde €600",
    active: true,
  },
  {
    id: "svc-005",
    name: "Civil Law",
    nameAr: "القانون المدني",
    description: "Wills, inheritance, and civil claims",
    descriptionAr: "الوصايا والميراث والدعاوى المدنية",
    icon: "FileText",
    price: "Consulta gratuita",
    active: true,
  },
  {
    id: "svc-006",
    name: "Criminal Law",
    nameAr: "القانون الجنائي",
    description: "Defense in criminal and serious cases",
    descriptionAr: "الدفاع في القضايا الجنائية والخطيرة",
    icon: "Shield",
    price: "Según caso",
    active: true,
  },
  {
    id: "svc-007",
    name: "Administrative Law",
    nameAr: "القانون الإداري",
    description: "Traffic fines appeal and administrative decisions",
    descriptionAr: "الطعن في مخالفات المرور والقرارات الإدارية",
    icon: "Scale",
    price: "Desde €150",
    active: true,
  },
  {
    id: "svc-008",
    name: "Immigration Law",
    nameAr: "قانون الهجرة",
    description: "Residency, work permits, family reunification",
    descriptionAr: "الإقامة وتصاريح العمل ولمّ الشمل",
    icon: "Globe",
    price: "Consulta gratuita",
    active: true,
  },
];

// ---- CRUD Operations ----

// Appointments
export function getAppointments(): Appointment[] {
  return [...appointments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getAppointmentById(id: string): Appointment | undefined {
  return appointments.find((a) => a.id === id);
}

export function createAppointment(
  data: Omit<Appointment, "id" | "createdAt">
): Appointment {
  const newApt: Appointment = {
    ...data,
    id: `apt-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  appointments.unshift(newApt);
  return newApt;
}

export function updateAppointment(
  id: string,
  data: Partial<Appointment>
): Appointment | null {
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  appointments[idx] = { ...appointments[idx], ...data };
  return appointments[idx];
}

export function deleteAppointment(id: string): boolean {
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  appointments.splice(idx, 1);
  return true;
}

// Articles
export function getArticles(publishedOnly = false): Article[] {
  const list = publishedOnly
    ? articles.filter((a) => a.published)
    : [...articles];
  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function createArticle(data: Omit<Article, "id" | "createdAt">): Article {
  const newArt: Article = {
    ...data,
    id: `art-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  articles.unshift(newArt);
  return newArt;
}

export function updateArticle(
  id: string,
  data: Partial<Article>
): Article | null {
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  articles[idx] = { ...articles[idx], ...data };
  return articles[idx];
}

export function deleteArticle(id: string): boolean {
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  articles.splice(idx, 1);
  return true;
}

// Services
export function getServices(activeOnly = false): Service[] {
  return activeOnly ? services.filter((s) => s.active) : [...services];
}

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function createService(data: Omit<Service, "id">): Service {
  const newSvc: Service = { ...data, id: `svc-${Date.now()}` };
  services.push(newSvc);
  return newSvc;
}

export function updateService(
  id: string,
  data: Partial<Service>
): Service | null {
  const idx = services.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  services[idx] = { ...services[idx], ...data };
  return services[idx];
}

export function deleteService(id: string): boolean {
  const idx = services.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  services.splice(idx, 1);
  return true;
}

// Stats
export function getStats() {
  return {
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter((a) => a.status === "pending")
      .length,
    confirmedAppointments: appointments.filter((a) => a.status === "confirmed")
      .length,
    totalArticles: articles.length,
    publishedArticles: articles.filter((a) => a.published).length,
    totalServices: services.filter((s) => s.active).length,
    casesWon: 4968,
    casesHandled: 5324,
  };
}

export const SERVICE_TYPES = [
  "Derecho Mercantil",
  "Derecho Bancario",
  "Derecho Laboral",
  "Derecho de Familia",
  "Derecho Civil",
  "Derecho Penal",
  "Derecho Administrativo",
  "Extranjería",
  "Derecho Inmobiliario",
  "Violencia de Género",
];

export const TIME_SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","16:00","16:30","17:00","17:30","18:00",
];
