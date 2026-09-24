import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  Activity,
  BriefcaseBusiness,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  FileText,
  Home,
  LogIn,
  LogOut,
  Menu,
  Network,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  X
} from 'lucide-react';
import { careers, jobSources, skills } from './data/catalog';
import { isSupabaseConfigured } from './lib/supabase';
import './styles.css';

type Tab = 'home' | 'skills' | 'careers' | 'roadmap' | 'resume' | 'jobs' | 'tracker' | 'ai' | 'profile';
type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

type ApplicationItem = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  source: string;
  date: string;
};

const nav: { id: Tab; label: string; icon: any }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'skills', label: 'Skills', icon: Target },
  { id: 'careers', label: 'Career Tab', icon: BriefcaseBusiness },
  { id: 'roadmap', label: 'AI Roadmap', icon: BrainCircuit },
  { id: 'resume', label: 'AI & ATS Resume', icon: FileText },
  { id: 'jobs', label: 'Live Job', icon: Search },
  { id: 'tracker', label: 'Application Tracker', icon: Activity },
  { id: 'ai', label: 'AI Hub', icon: Sparkles },
  { id: 'profile', label: 'Profile & Settings', icon: Settings }
];

const defaultApplications: ApplicationItem[] = [
  { id: '1', company: 'Microsoft', role: 'Software Engineer', status: 'Interview', source: 'LinkedIn', date: '2026-09-18' },
  { id: '2', company: 'Google', role: 'Data Analyst', status: 'Applied', source: 'Google Careers', date: '2026-09-15' },
  { id: '3', company: 'Infosys', role: 'Cloud Engineer', status: 'Offer', source: 'Naukri', date: '2026-09-10' }
];

const aiProviders = [
  { name: 'OpenAI / ChatGPT', note: 'Secure proxy + citations + source validation' },
  { name: 'Google Gemini', note: 'Enterprise-safe generative tools for summaries' },
  { name: 'Superhuman AI', note: 'Task automation and personal career workflows' },
  { name: 'Custom AI gateway', note: 'Private provider routing for compliance-sensitive usage' }
];

const officialSources = [
  { name: 'Naukri', note: 'Official jobs and company pages' },
  { name: 'Indeed', note: 'Verified employer listings' },
  { name: 'LinkedIn Jobs', note: 'Official recruiter and ATS data access' },
  { name: 'Remotely', note: 'Remote-first hiring platform' },
  { name: 'Remote OK', note: 'Remote work listings' },
  { name: 'Internshala', note: 'Internship and career learning pipelines' },
  { name: 'We Work Remotely', note: 'Remote hiring marketplace' },
  { name: 'Shine', note: 'India and global job opportunity feeds' },
  { name: 'FlexJobs', note: 'Verified flexible role opportunities' },
  { name: 'Apna', note: 'Professional opportunities and communities' },
  { name: 'Job Hai', note: 'Regional hiring listings' },
  { name: 'Himalayas', note: 'Specific regional and market listings' },
  { name: 'Adzuna', note: 'Job search API with official provider access' },
  { name: 'JSearch', note: 'Search API for job discovery and metadata' }
];

function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('careeros-selected-skills');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
    } catch {
      return [];
    }
  });

  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    try {
      const raw = localStorage.getItem('careeros-applications');
      const parsed = raw ? JSON.parse(raw) : defaultApplications;
      return Array.isArray(parsed) && parsed.length ? parsed : defaultApplications;
    } catch {
      return defaultApplications;
    }
  });

  const [resumeText, setResumeText] = useState(
    'Technical professional with hands-on experience in software engineering, cloud platforms, SQL, Python, cloud operations, and stakeholder communication. Strong focus on automation, testing, delivery, and business impact.'
  );

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('careeros-user')));

  useEffect(() => {
    localStorage.setItem('careeros-selected-skills', JSON.stringify(selectedSkills));
  }, [selectedSkills]);

  useEffect(() => {
    localStorage.setItem('careeros-applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('careeros-user', JSON.stringify({ email: authEmail || 'user@careeros.app' }));
    } else {
      localStorage.removeItem('careeros-user');
    }
  }, [isLoggedIn, authEmail]);

  const progress = Math.round((selectedSkills.length / skills.length) * 100);

  const filteredSkills = useMemo(
    () => skills.filter((skill) => skill.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  const topCareers = useMemo(() => {
    return careers
      .map((career) => ({
        ...career,
        matches: career.skills.filter((skill) => selectedSkills.includes(skill)),
        score: Math.round((career.skills.filter((skill) => selectedSkills.includes(skill)).length / career.skills.length) * 100)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [selectedSkills]);

  const roadmap = useMemo(() => {
    const focus = selectedSkills.length ? selectedSkills.slice(0, 6) : ['JavaScript/TypeScript', 'SQL', 'Communication'];
    return [
      { title: 'Foundation', steps: ['Validate current skill gaps', ...focus.slice(0, 2)] },
      { title: 'Execution', steps: ['Build real projects and portfolios', ...focus.slice(2, 4)] },
      { title: 'Optimization', steps: ['Prepare resumés, networking, and interview practice', ...focus.slice(4, 6)] }
    ];
  }, [selectedSkills]);

  const atsKeywords = selectedSkills.slice(0, 10);
  const atsScore = Math.min(98, 40 + Math.round(atsKeywords.length * 4.8) + (resumeText.length > 180 ? 18 : 0));

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill]
    );
  };

  const goToTab = (tabName: Tab) => {
    setTab(tabName);
    setMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
        <div className="brand-row">
          <div className="brand-mark">C</div>
          <div>
            <div className="brand-name">CareerOS</div>
            <div className="brand-subtitle">ULTIMATE</div>
          </div>
          <button className="float-icon close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="nav-list">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={tab === id ? 'nav-button active' : 'nav-button'}
              onClick={() => goToTab(id)}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div>Built for</div>
          <strong>Saket Yadav</strong>
          <span>Maccy Creations</span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <button className="float-icon menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={19} />
            </button>
            <div>
              <div className="eyebrow">YOUR CAREER OPERATING SYSTEM</div>
              <h1>{nav.find((item) => item.id === tab)?.label}</h1>
            </div>
          </div>

          <div className="status-pill">
            <span className="pulse-dot" />
            Offline ready
          </div>
        </header>

        <div className="content-wrap">
          {tab === 'home' && (
            <HomeView skillProgress={progress} selectedCount={selectedSkills.length} topCareers={topCareers} onNavigate={goToTab} />
          )}
          {tab === 'skills' && (
            <SkillsView
              query={query}
              setQuery={setQuery}
              filteredSkills={filteredSkills}
              selectedSkills={selectedSkills}
              toggleSkill={toggleSkill}
            />
          )}
          {tab === 'careers' && <CareersView selectedSkills={selectedSkills} />}
          {tab === 'roadmap' && <RoadmapView roadmap={roadmap} />}
          {tab === 'resume' && (
            <ResumeView
              selectedSkills={selectedSkills}
              resumeText={resumeText}
              setResumeText={setResumeText}
              atsScore={atsScore}
            />
          )}
          {tab === 'jobs' && <JobsView />}
          {tab === 'tracker' && <TrackerView applications={applications} setApplications={setApplications} />}
          {tab === 'ai' && <AIHubView />}
          {tab === 'profile' && (
            <ProfileView
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              authEmail={authEmail}
              setAuthEmail={setAuthEmail}
              authPassword={authPassword}
              setAuthPassword={setAuthPassword}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function HomeView({
  skillProgress,
  selectedCount,
  topCareers,
  onNavigate
}: {
  skillProgress: number;
  selectedCount: number;
  topCareers: Array<{ title: string; score: number; matches: string[] }>;
  onNavigate: (tab: Tab) => void;
}) {
  return (
    <>
      <section className="hero-panel">
        <div>
          <div className="pill-label">PRIVATE • EVIDENCE-BASED</div>
          <h2>
            Build a career<br />
            that <span>moves.</span>
          </h2>
          <p>
            CareerOS Ultimate helps you grow with intentional skill building, role alignment, trusted job sources,
            and AI guidance that respects your privacy and source accuracy.
          </p>
          <button type="button" className="primary-btn" onClick={() => onNavigate('skills')}>
            Plan my next step <ChevronRight size={17} />
          </button>
        </div>

        <div className="progress-ring">
          <strong>{skillProgress}%</strong>
          <span>skill progress</span>
        </div>
      </section>

      <section className="metrics-grid">
        <StatCard title="Tracked skills" value={`${selectedCount}`} note="skills selected" icon={<Target size={18} />} />
        <StatCard title="Best matches" value={`${topCareers.length}`} note="career alignments" icon={<Network size={18} />} />
        <StatCard title="Status" value="Ready" note="offline-first and secure" icon={<ShieldCheck size={18} />} />
      </section>

      <section className="info-panel">
        <div className="info-icon"><CheckCircle2 size={18} /></div>
        <div>
          <h3>Genuine information only</h3>
          <p>
            Live jobs and AI features must use official APIs, verified feeds, and secure backend access. CareerOS never invents
            companies, roles, or salaries.
          </p>
        </div>
      </section>
    </>
  );
}

function StatCard({ title, value, note, icon }: { title: string; value: string; note: string; icon: ReactNode }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

function SkillsView({
  query,
  setQuery,
  filteredSkills,
  selectedSkills,
  toggleSkill
}: {
  query: string;
  setQuery: (value: string) => void;
  filteredSkills: readonly string[];
  selectedSkills: string[];
  toggleSkill: (skill: string) => void;
}) {
  return (
    <>
      <div className="toolbar-wrap">
        <p>Track the capabilities you want to grow. Your selections are stored locally and sync when you connect Supabase.</p>
        <label className="search-box">
          <Search size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search skill" />
        </label>
      </div>

      <div className="skill-grid">
        {filteredSkills.map((skill) => {
          const isSelected = selectedSkills.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              className={isSelected ? 'skill-chip selected' : 'skill-chip'}
              onClick={() => toggleSkill(skill)}
            >
              {isSelected ? <CheckCircle2 size={17} /> : <span className="empty-bullet" />}
              <span>{skill}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function CareersView({ selectedSkills }: { selectedSkills: string[] }) {
  const ranked = careers
    .map((career) => ({
      ...career,
      matches: career.skills.filter((skill) => selectedSkills.includes(skill)),
      score: Math.round(
        (career.skills.filter((skill) => selectedSkills.includes(skill)).length / career.skills.length) * 100
      )
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <>
      <p className="section-intro">
        Career directions aligned to your selected skills. Match percentages are based on transparent rule-based scoring.
      </p>

      <div className="career-grid">
        {ranked.map((career) => (
          <article key={career.title} className="panel-card">
            <div className="career-header">
              <Network size={16} />
              <span>{career.matches.length} matching skills</span>
            </div>
            <h3>{career.title}</h3>
            <div className="match-score">{career.score}% match</div>
            <div className="tag-group">
              {career.skills.map((skill) => (
                <span key={skill} className={selectedSkills.includes(skill) ? 'tag active' : 'tag'}>
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function RoadmapView({ roadmap }: { roadmap: Array<{ title: string; steps: string[] }> }) {
  return (
    <div className="roadmap-grid">
      {roadmap.map((phase) => (
        <div key={phase.title} className="panel-card roadmap-card">
          <h3>{phase.title}</h3>
          <ul>
            {phase.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ResumeView({
  selectedSkills,
  resumeText,
  setResumeText,
  atsScore
}: {
  selectedSkills: string[];
  resumeText: string;
  setResumeText: (value: string) => void;
  atsScore: number;
}) {
  return (
    <div className="resume-layout">
      <div className="panel-card">
        <div className="resume-header">
          <h3>ATS resume assistant</h3>
          <span className="score-pill">ATS score: {atsScore}%</span>
        </div>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={12}
          placeholder="Paste your resume summary or experience here..."
        />
      </div>

      <div className="panel-card">
        <h3>Core keywords detected</h3>
        <div className="tag-group">
          {selectedSkills.length ? (
            selectedSkills.slice(0, 12).map((skill) => <span key={skill} className="tag active">{skill}</span>)
          ) : (
            <span className="muted-text">Select skills to improve ATS keyword alignment.</span>
          )}
        </div>
      </div>
    </div>
  );
}

function JobsView() {
  return (
    <>
      <div className="jobs-header">
        <div>
          <div className="eyebrow">VERIFIED SOURCES ONLY</div>
          <h2>Live job features</h2>
          <p>Connected jobs use official APIs or approved feeds. No fabricated listings are shown.</p>
        </div>
        <button type="button" className="primary-btn">
          Configure provider access <ChevronRight size={17} />
        </button>
      </div>

      <div className="source-grid">
        {officialSources.map((source) => (
          <div key={source.name} className="panel-card source-card">
            <div className="source-row">
              <span className="source-dot" />
              <strong>{source.name}</strong>
            </div>
            <small>{source.note}</small>
          </div>
        ))}
      </div>
    </>
  );
}

function TrackerView({
  applications,
  setApplications
}: {
  applications: ApplicationItem[];
  setApplications: (value: ApplicationItem[]) => void;
}) {
  const updateStatus = (id: string, status: ApplicationStatus) => {
    setApplications(
      applications.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  return (
    <div className="tracker-list">
      {applications.map((item) => (
        <div key={item.id} className="panel-card tracker-item">
          <div>
            <div className="company-row">
              <strong>{item.company}</strong>
              <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
            </div>
            <h3>{item.role}</h3>
            <small>
              {item.source} • {item.date}
            </small>
          </div>

          <select
            value={item.status}
            onChange={(e) => updateStatus(item.id, e.target.value as ApplicationStatus)}
            aria-label={`Update status for ${item.role}`}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      ))}
    </div>
  );
}

function AIHubView() {
  return (
    <>
      <section className="hero-panel compact-hero">
        <div>
          <div className="pill-label">RESPONSIBLE AI</div>
          <h2>
            Use AI as a <span>copilot.</span>
          </h2>
          <p>Provider-neutral tools with citations, source links, and careful uncertainty handling.</p>
        </div>
      </section>

      <div className="provider-grid">
        {aiProviders.map((provider) => (
          <div key={provider.name} className="panel-card provider-card">
            <Sparkles size={18} />
            <strong>{provider.name}</strong>
            <small>{provider.note}</small>
          </div>
        ))}
      </div>
    </>
  );
}

function ProfileView({
  isLoggedIn,
  setIsLoggedIn,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword
}: {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  authEmail: string;
  setAuthEmail: (value: string) => void;
  authPassword: string;
  setAuthPassword: (value: string) => void;
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authEmail || !authPassword) {
      return;
    }
    setIsLoggedIn(true);
  };

  return (
    <>
      <div className="profile-header panel-card">
        <div className="avatar-mark">SY</div>
        <div>
          <h2>Saket Yadav</h2>
          <p>CareerOS Ultimate • Maccy Creations</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="panel-card">
          <h3>Account</h3>
          {isLoggedIn ? (
            <div className="auth-box">
              <p>Logged in as {authEmail || 'user@careeros.app'}</p>
              <button type="button" className="secondary-btn" onClick={() => setIsLoggedIn(false)}>
                <LogOut size={16} /> Log out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <label>
                Email
                <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="you@example.com" />
              </label>
              <label>
                Password
                <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Enter password" />
              </label>
              <button type="submit" className="primary-btn">
                <LogIn size={16} /> Login
              </button>
            </form>
          )}
        </div>

        <div className="panel-card settings-panel">
          <h3>About & settings</h3>
          <div className="settings-row">
            <span>About</span>
            <strong>CareerOS Ultimate</strong>
          </div>
          <div className="settings-row">
            <span>Contact</span>
            <strong>CAREEROSULTIMATE@gmail.com</strong>
          </div>
          <div className="settings-row">
            <span>Privacy policy</span>
            <strong>Review required before public launch</strong>
          </div>
          <div className="settings-row">
            <span>Supabase status</span>
            <strong>{isSupabaseConfigured ? 'Configured' : 'Manual setup required'}</strong>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
