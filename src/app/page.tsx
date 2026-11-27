"use client";

import { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  Activity, ArrowDownRight, ArrowRight, Bike, CalendarDays, Check,
  ChevronDown, CircleHelp, Clock3, Flame, Gift, Grid2X2, Leaf,
  MapPin, Plus, QrCode, ScanLine, ShieldCheck, Sparkles, Ticket,
  Trophy, Users, Wallet, Wind, X, Zap
} from "lucide-react";

type Tab = "home" | "missions" | "wallet" | "team";
type Mission = { id: number; title: string; subtitle: string; points: number; icon: "bike" | "recycle" | "train" | "cup"; done: boolean; progress: number };

const initialMissions: Mission[] = [
  { id: 1, title: "Pedometer Langkah Kaki", subtitle: "Berjalan atau bersepeda menuju kampus.", points: 80, icon: "bike", done: false, progress: 80 },
  { id: 2, title: "Botol Daur Ulang RVM", subtitle: "Setorkan botol plastik ke mesin RVM mitra.", points: 50, icon: "recycle", done: false, progress: 75 },
  { id: 3, title: "Naik KRL / Bus TransKota", subtitle: "Pilih transportasi publik untuk perjalananmu.", points: 100, icon: "train", done: true, progress: 100 },
  { id: 4, title: "Tumbler di Mitra UMKM", subtitle: "Bawa tumbler saat membeli minuman.", points: 50, icon: "cup", done: false, progress: 0 }
];

const vouchers = [
  { name: "Kedai Kopi Sudirman", offer: "Diskon Rp10.000", points: "Tukar 200 Pts", code: "KPSL-KOPI-88", tone: "coffee" },
  { name: "Toko Kelontong Berkah", offer: "Diskon Belanja 15%", points: "Tukar 150 Pts", code: "KPSL-BERKAH", tone: "store" },
  { name: "Tiket Bus TransKota", offer: "Gratis 1 Perjalanan", points: "Tukar 100 Pts", code: "KPSL-BUS-01", tone: "transit" }
];

const missionIcon = (icon: Mission["icon"]) => {
  if (icon === "bike") return <Bike size={18} />;
  if (icon === "recycle") return <Leaf size={18} />;
  if (icon === "train") return <Activity size={18} />;
  return <Gift size={18} />;
};

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [period, setPeriod] = useState("Harian");
  const [missions, setMissions] = useState(initialMissions);
  const [energy, setEnergy] = useState(68);
  const [points, setPoints] = useState(2450);
  const [streak, setStreak] = useState(25);
  const [modal, setModal] = useState<"loot" | "gps" | "receipt" | null>(null);
  const [opened, setOpened] = useState(false);
  const [campus, setCampus] = useState("Kampus Tegalboto");
  const [campusOpen, setCampusOpen] = useState(false);
  const [range, setRange] = useState(6420);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [toast, setToast] = useState("");

  const completed = missions.filter((m) => m.done).length;
  const progress = useMemo(() => Math.round(completed / missions.length * 100), [completed]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function completeMission(id: number) {
    const mission = missions.find((m) => m.id === id);
    if (!mission || mission.done) return;
    setMissions((items) => items.map((m) => m.id === id ? { ...m, done: true, progress: 100 } : m));
    setEnergy((value) => Math.min(100, value + mission.points / 5));
    setPoints((value) => value + mission.points);
    notify("Misi selesai · energi dan poin bertambah");
  }

  function openCapsule() {
    if (energy < 100) { setTab("missions"); notify("Selesaikan misi untuk mengisi energi"); return; }
    setModal("loot");
    setOpened(false);
  }

  function revealReward() {
    setOpened(true);
    setPoints((value) => value + 250);
    setStreak((value) => value + 1);
    confetti({ particleCount: 100, spread: 75, origin: { y: 0.62 }, colors: ["#0057FF", "#FACC15", "#FFFFFF"] });
  }

  return (
    <main className="kapsul-shell">
      <div className="app-frame">
        <header className="topbar">
          <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setTab("home"); }}>
            <span className="brand-symbol"><span /></span>
            <span><b>KAPSUL</b><small>Eco-Citizen Platform</small></span>
          </a>
          <div className="top-actions">
            <span className="city-pill"><MapPin size={13} /> AREA KOTA</span>
            <button className="round-action" aria-label="Bantuan" onClick={() => notify("KAPSUL · Aksi kecil, dampak besar")}><CircleHelp size={18} /></button>
            <button className="avatar-button" aria-label="Profil">N</button>
          </div>
        </header>

        <aside className="sidebar">
          <div className="side-user"><div className="avatar-large">N</div><div><b>Nabila</b><small>Eco Citizen · Level 2</small></div></div>
          <p className="side-label">MENU UTAMA</p>
          <button className={tab === "home" ? "side-link active" : "side-link"} onClick={() => setTab("home")}><Grid2X2 size={18} /> Beranda</button>
          <button className={tab === "missions" ? "side-link active" : "side-link"} onClick={() => setTab("missions")}><Check size={18} /> Misi Harian <span className="side-count">{missions.length - completed}</span></button>
          <button className={tab === "wallet" ? "side-link active" : "side-link"} onClick={() => setTab("wallet")}><Ticket size={18} /> Voucher</button>
          <button className={tab === "team" ? "side-link active" : "side-link"} onClick={() => setTab("team")}><Users size={18} /> Tim</button>
          <div className="side-bottom"><div className="side-mini-card"><span><Flame size={16} /></span><b>{streak} hari streak</b><small>Konsistensi hijau terjaga!</small></div><small className="side-version">KAPSUL PWA · v2.4.0</small></div>
        </aside>

        <section className="main-content">
          <div className="mobile-greeting"><div><span className="eyebrow">SELAMAT DATANG KEMBALI</span><h1>Halo, Nabila!</h1><p>Kecil langkahmu, besar dampaknya.</p></div><div className="avatar-large">N</div></div>

          {tab === "home" && <>
            <div className="dashboard-toolbar">
              <div><span className="eyebrow">RINGKASAN AKTIVITAS</span><h2>Dashboard Eco Citizen</h2></div>
              <button className="campus-picker" onClick={() => setCampusOpen(!campusOpen)}><MapPin size={15} /> {campus} <ChevronDown size={15} /></button>
              {campusOpen && <div className="campus-menu">{["Kampus Tegalboto", "Kampus Bondowoso", "Kampus Lumajang"].map((name) => <button key={name} onClick={() => { setCampus(name); setCampusOpen(false); }}>{name}{campus === name && <Check size={14} />}</button>)}</div>}
            </div>

            <div className="period-switch">{["Harian", "Mingguan", "Bulanan", "Semester"].map((name) => <button key={name} className={period === name ? "selected" : ""} onClick={() => setPeriod(name)}>{name}</button>)}</div>

            <section className="weekly-target bento-card">
              <div className="card-heading"><div><span className="heading-dot" /> <b>Target {period} Eco</b></div><span className="success-pill">{completed + 2}/7 Tercapai</span></div>
              <div className="week-days">{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day, index) => <div className={index < 4 ? "day-item complete" : index === 4 ? "day-item current" : "day-item"} key={day}><span>{index < 4 ? <Check size={18} /> : index === 4 ? "K" : "•"}</span><small>{day}</small></div>)}</div>
            </section>

            <section className="streak-hero">
              <div className="hero-top"><span className="eyebrow light">CELENGAN ENERGI KAPSUL</span><span className="streak-badge"><Flame size={15} /> {streak} Hari</span></div>
              <h2>Keep It Up!</h2><p>Target emisi bersama komunitas kota<br className="desktop-only" /> tercapai 68%</p>
              <div className="hero-stats"><strong>{energy}<em>%</em></strong><span>Terkumpul di Kota</span><div><small>Sisa Kuota Drop</small><b>32 <small>/ 100 Slot</small></b></div></div>
              <div className="hero-progress"><span style={{ width: energy + "%" }} /></div>
              <div className="hero-foot"><span><Clock3 size={12} /> Tutup drop box: <b>02:45:04</b></span><span>Offset: −184.2 kg CO₂</span></div>
            </section>

            <section className="task-card bento-card">
              <div className="task-heading"><div><span className="heading-dot navy" /><b>Task Board Aktivitas Hijau</b></div><div className="legend"><span>Berjalan</span><span>Selesai</span></div></div>
              <div className="task-list">
                <div className="task-row"><div className="task-label"><Bike size={15} /><b>Pedometer Langkah Kaki</b><strong>{range.toLocaleString("id-ID")} <small>/ 8,000</small></strong></div><div className="task-track"><span style={{ width: Math.min(100, range / 8000 * 100) + "%" }} /></div></div>
                <div className="task-row"><div className="task-label"><Leaf size={15} /><b>Botol Daur Ulang RVM</b><strong>3 Botol <small>/ 4 Target</small></strong></div><div className="task-track"><span className="blue-fill" style={{ width: "75%" }} /></div></div>
                <div className="task-row"><div className="task-label"><Activity size={15} /><b>Naik KRL / Bus TransKota</b><span className="success-pill">✓ 100% Selesai</span></div><div className="task-track gold-track"><span style={{ width: "100%" }} /></div></div>
              </div>
            </section>

            <div className="stat-grid">
              <section className="stat-card bento-card"><div className="stat-top"><span className="stat-icon blue"><Wallet size={17} /></span><span className="success-pill">Siap Belanja</span></div><small>Saldo Cuan Eco</small><strong>Rp 24.500</strong><button onClick={() => setTab("wallet")}>Tarik / Redeem <ArrowRight size={14} /></button></section>
              <section className="stat-card streak-card bento-card"><div className="stat-top"><span className="stat-icon yellow"><Flame size={18} /></span><span className="gold-pill">Streak Days</span></div><strong>{streak}<small> Hari</small></strong><small>Konsistensi Hijau</small><span className="top-percent"><Trophy size={12} /> Top 5% Eco Citizen</span></section>
            </div>

            <button className="collect-button" onClick={openCapsule}><span><Plus size={18} /></span> Kumpulkan Energi Sekarang <ArrowRight size={17} /></button>
            <p className="helper-note"><ScanLine size={13} /> Scan QR Kapsul di Halte Bus, Stasiun, atau RVM Mitra Kota</p>
          </>}

          {tab === "missions" && <>
            <div className="page-heading"><span className="eyebrow">LEVEL UP YOUR IMPACT</span><h1>Misi Harian</h1><p>Selesaikan aksi hijau dan kumpulkan energi kapsul.</p></div>
            <section className="streak-hero mission-hero"><div className="hero-top"><span className="eyebrow light">KONSISTENSI MISI</span><span className="streak-badge"><Flame size={15} /> {streak} Hari Streak</span></div><h2>Pertahankan!</h2><p>Dividen energi aktif berlipat ganda<br /> dari aksi hijau harianmu.</p><div className="hero-stats"><strong>{completed}<em>/{missions.length}</em></strong><span>Target Misi Hari Ini</span><div><small>Dampak Lingkungan</small><b>−184.2 kg CO₂</b></div></div><div className="hero-progress"><span style={{ width: progress + "%" }} /></div><div className="hero-foot"><span><Clock3 size={12} /> Reset Misi: <b>02:45:04</b></span><span>{progress}% Tuntas</span></div></section>
            <section className="weekly-target bento-card"><div className="card-heading"><div><span className="heading-dot" /><b>Target Harian Eco</b></div><span className="success-pill">5/7 Tercapai</span></div><div className="week-days">{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day, index) => <div className={index < 4 ? "day-item complete" : index === 4 ? "day-item current" : "day-item"} key={day}><span>{index < 4 ? <Check size={18} /> : index === 4 ? "K" : "•"}</span><small>{day}</small></div>)}</div></section>
            <section className="task-card bento-card"><div className="task-heading"><div><span className="heading-dot navy" /><b>Task Board Aktivitas Hijau</b></div><div className="legend"><span>Berjalan</span><span>Selesai</span></div></div>{missions.map((mission) => <article className="mission-row" key={mission.id}><div className={"mission-icon mi-" + mission.id}>{missionIcon(mission.icon)}</div><div className="mission-info"><div className="mission-title"><b>{mission.title}</b><span>{mission.done ? "✓ Selesai" : "+" + mission.points + " Pts"}</span></div><p>{mission.subtitle}</p><div className="task-track"><span style={{ width: mission.progress + "%" }} /></div><div className="mission-action-row"><small>{mission.done ? "Aktivitas terverifikasi" : mission.progress + "% progres"}</small><button disabled={mission.done} onClick={() => mission.id === 1 ? setModal("gps") : completeMission(mission.id)}>{mission.done ? "Selesai" : mission.id === 1 ? "Lacak" : mission.id === 2 ? "Scan" : "Klaim"} <ArrowRight size={13} /></button></div></div></article>)}</section>
            <button className="collect-button" onClick={() => notify("Fitur misi kustom segera hadir")}><Plus size={18} /> Tambah Misi Kustom</button>
          </>}

          {tab === "wallet" && <>
            <div className="page-heading"><span className="eyebrow">YOUR LITTLE TREASURES</span><h1>Dompet Voucher</h1><p>Reward dari aksi baikmu, siap digunakan.</p></div>
            <section className="wallet-hero"><div className="wallet-heading"><span className="gold-pill">Saldo Siap Belanja</span><QrCode size={19} /></div><h2>Rp 74.500</h2><p>Bisa ditransfer ke rekening/E-Wallet atau ditukar voucher kuliner lokal.</p><div className="wallet-actions"><button onClick={() => notify("Penarikan saldo demo")}>Tarik Saldo</button><button onClick={() => setModal("receipt")}><QrCode size={15} /> Pindai QR</button></div></section>
            <section className="qr-card bento-card"><div className="qr-title"><QrCode size={18} /><b>QR Kasir UMKM</b><span>Langsung Scan</span></div><div className="fake-qr"><div className="qr-pattern" /><span>K</span></div><small>KODE PENUKARAN</small><div className="redeem-code">KPSL–UMKM–7721 <button onClick={() => { navigator.clipboard?.writeText("KPSL-UMKM-7721"); notify("Kode disalin"); }}>Salin</button></div><p>Tunjukkan ke kasir Warung Kopi / Mitra UMKM terdaftar saat transaksi</p></section>
            <div className="wallet-mini-grid"><div className="bento-card"><Ticket size={18} /><small>Voucher Dimiliki</small><b>4 Kupon</b></div><div className="bento-card"><MapPin size={18} /><small>Mitra Sekitarmu</small><b>28 Toko</b></div></div>
            <section className="voucher-list bento-card"><div className="section-title"><div><h3>Voucher Tersedia</h3><p>Pilihan kuliner & retail lokal</p></div><button onClick={() => notify("Semua voucher ditampilkan")}>Lihat Semua</button></div>{vouchers.map((voucher) => <div className="voucher-item" key={voucher.code}><div className={"voucher-thumb " + voucher.tone}><Ticket size={20} /></div><div><b>{voucher.name}</b><span>{voucher.offer}</span><small>{voucher.points}</small></div><button disabled={claimed.includes(voucher.code)} onClick={() => { setClaimed((items) => [...items, voucher.code]); setPoints((value) => Math.max(0, value - 200)); notify("Voucher berhasil diklaim"); }}>{claimed.includes(voucher.code) ? "Tersimpan" : "Gunakan"}</button></div>)}</section>
          </>}

          {tab === "team" && <>
            <div className="page-heading"><span className="eyebrow">GROW TOGETHER</span><h1>Tim Eco Citizen</h1><p>Aksi kecil terasa lebih besar saat dilakukan bersama.</p></div>
            <section className="team-hero"><span className="eyebrow light">KOMUNITAS KOTA</span><h2>68% target kota tercapai</h2><p>Kamu bagian dari gerakan menuju kota yang lebih bersih.</p><div className="hero-progress"><span style={{ width: "68%" }} /></div><div className="team-numbers"><div><b>1.248</b><small>Eco Citizen</small></div><div><b>8.420</b><small>Aksi hijau</small></div><div><b>−184 kg</b><small>CO₂ estimasi</small></div></div></section>
            <section className="leaderboard bento-card"><div className="section-title"><div><h3>Eco Leaderboard</h3><p>Peringkat minggu ini</p></div><span className="success-pill">Mingguan</span></div>{[{name:"Alya Putri",pts:"3.820",rank:"01"},{name:"Raka Pratama",pts:"3.140",rank:"02"},{name:"Nabila",pts:points.toLocaleString("id-ID"),rank:"03"},{name:"Dimas Saputra",pts:"2.120",rank:"04"}].map((person) => <div className="leader-row" key={person.rank}><span>{person.rank}</span><div className="leader-avatar">{person.name.charAt(0)}</div><b>{person.name}</b><strong>{person.pts} <small>Pts</small></strong></div>)}</section>
            <button className="collect-button" onClick={() => notify("Tautan undangan tim disalin")}><Users size={17} /> Ajak Teman Bergabung</button>
          </>}
        </section>

        <nav className="bottom-nav">
          <button className={tab === "home" ? "active" : ""} onClick={() => setTab("home")}><Grid2X2 size={19} /><small>Beranda</small></button>
          <button className={tab === "missions" ? "active" : ""} onClick={() => setTab("missions")}><Check size={19} /><small>Misi</small>{missions.length - completed > 0 && <i />}</button>
          <button className="nav-add" onClick={openCapsule}><Plus size={23} /></button>
          <button className={tab === "wallet" ? "active" : ""} onClick={() => setTab("wallet")}><Ticket size={19} /><small>Voucher</small></button>
          <button className={tab === "team" ? "active" : ""} onClick={() => setTab("team")}><Users size={19} /><small>Tim</small></button>
        </nav>
      </div>

      {toast && <div className="toast-message"><Check size={15} /> {toast}</div>}
      {modal && <div className="modal-backdrop" onClick={() => setModal(null)}><section className="modal-panel" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)}><X size={19} /></button>
        {modal === "loot" && <div className="modal-content loot-modal">{!opened ? <><span className="eyebrow">WEEKLY SURPRISE</span><div className="loot-capsule"><div><Leaf size={28} /></div><span /></div><h2>Kapsulmu siap dibuka!</h2><p>Energi penuh. Saatnya panen hasil dari aksi baikmu.</p><button className="modal-primary" onClick={revealReward}>BUKA KAPSUL <Sparkles size={17} /></button></> : <><div className="reward-icon"><Gift size={34} /></div><span className="eyebrow">SELAMAT, ECO CITIZEN!</span><h2>Kamu dapat hadiah!</h2><div className="reward-ticket"><small>VOUCHER PARTNER</small><b>Rp25.000</b><span>+250 POIN KAPSUL</span></div><button className="modal-primary" onClick={() => { setModal(null); setTab("wallet"); }}>SIMPAN KE DOMPET <Wallet size={17} /></button></>}</div>}
        {modal === "gps" && <div className="modal-content"><div className="reward-icon"><MapPin size={28} /></div><span className="eyebrow">GPS ANTI-CURANG</span><h2>Validasi titik drop</h2><p>Pastikan kamu berada di area mitra. Jarak simulasi saat ini 4,2 meter dari titik RVM.</p><div className="gps-demo"><div className="gps-radar"><span /><b><MapPin size={18} /></b></div><div><strong>4,2 Meter</strong><small>Radius aman &lt; 15 meter</small></div><span className="success-pill">Lolos uji</span></div><button className="modal-primary" onClick={() => { setModal(null); completeMission(1); }}>KONFIRMASI & LANJUT <ArrowRight size={16} /></button></div>}
        {modal === "receipt" && <div className="modal-content"><div className="reward-icon"><QrCode size={27} /></div><span className="eyebrow">KAPSUL DIGITAL RECEIPT</span><h2>Struk dampakmu</h2><div className="receipt-line"><span>Energi terkumpul</span><b>{energy}/100</b></div><div className="receipt-line"><span>Poin tersedia</span><b>{points.toLocaleString("id-ID")} Pts</b></div><div className="receipt-line"><span>Misi selesai</span><b>{completed}/{missions.length}</b></div><button className="modal-primary" onClick={() => setModal(null)}>SELESAI <Check size={16} /></button></div>}
      </section></div>}
    </main>
  );
}
