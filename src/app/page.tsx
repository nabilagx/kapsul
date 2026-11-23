"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  Activity, ArrowDownRight, ArrowRight, Bike, Camera, Check, ChevronDown,
  CircleHelp, Clock3, Copy, Gift, Leaf, MapPin, Menu, Plus, QrCode,
  Share2, ShieldCheck, Sparkles, Ticket, Wallet, Wind, X, Zap
} from "lucide-react";

type Tab = "home" | "missions" | "wallet";
type Mission = { id: number; title: string; subtitle: string; reward: string; icon: "bike" | "leaf" | "users"; done: boolean; tag: string };

const initialMissions: Mission[] = [
  { id: 1, title: "Jalan kaki, bukan motor", subtitle: "Tempuh 3,2 km dengan berjalan kaki atau bersepeda.", reward: "+25 energi", icon: "bike", done: false, tag: "TRANSPORTASI" },
  { id: 2, title: "Pilah sampahmu", subtitle: "Setorkan sampah terpilah ke titik drop-off terdekat.", reward: "+35 energi", icon: "leaf", done: false, tag: "PENGELOLAAN SAMPAH" },
  { id: 3, title: "Ajak satu teman", subtitle: "Bagikan KAPSUL dan mulai aksi bareng.", reward: "+20 energi", icon: "users", done: false, tag: "KOMUNITAS" }
];

const vouchers = [
  { brand: "Kopi Titik Temu", title: "Diskon Rp5.000", code: "KAPSUL5K", expiry: "Berlaku sampai 30 Nov 2026", tone: "blue" },
  { brand: "Refill Station", title: "Potongan Rp10.000", code: "ISIULANG10", expiry: "Berlaku sampai 15 Des 2026", tone: "green" }
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [missions, setMissions] = useState(initialMissions);
  const [energy, setEnergy] = useState(40);
  const [modal, setModal] = useState<"loot" | "receipt" | "help" | null>(null);
  const [opened, setOpened] = useState(false);
  const [bursting, setBursting] = useState(false);
  const [rewardVisible, setRewardVisible] = useState(false);
  const [liveTime, setLiveTime] = useState("--:--:--");
  const [saved, setSaved] = useState(false);
  const [campus, setCampus] = useState("Kampus Tegalboto");
  const [showCampus, setShowCampus] = useState(false);
  const [distance, setDistance] = useState(0);
  const [wasteFile, setWasteFile] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  useEffect(() => {
    const update = () => setLiveTime(new Date().toLocaleTimeString("id-ID", { hour12: false }));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const completed = missions.filter((m) => m.done).length;
  const impact = useMemo(() => (completed * 15 + (opened ? 45 : 0)), [completed, opened]);

  function completeMission(id: number) {
    setMissions((prev) => prev.map((m) => m.id === id ? { ...m, done: true } : m));
    const selected = missions.find((m) => m.id === id);
    if (selected && !selected.done) setEnergy((v) => Math.min(100, v + (id === 1 ? 25 : id === 2 ? 35 : 20)));
  }

  function copyReferral() {
    if (navigator.clipboard) navigator.clipboard.writeText("KAPSUL-NABILA").catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function triggerCapsuleOpen() {
    if (bursting || opened) return;
    setBursting(true);
    window.setTimeout(() => {
      setOpened(true);
      setBursting(false);
      confetti({
        particleCount: 110,
        spread: 78,
        origin: { y: 0.62 },
        colors: ["#0057FF", "#FACC15", "#FFFFFF"]
      });
    }, 800);
    window.setTimeout(() => setRewardVisible(true), 1000);
  }

  function openLoot() {
    setModal("loot");
    setOpened(false);
    setBursting(false);
    setRewardVisible(false);
    setSaved(false);
  }

  return (
    <main className="app-shell">
      <div className="phone-frame">
        <header className="topbar">
          <a className="brand" href="#" onClick={(e) => { e.preventDefault(); setTab("home"); }}>
            <span className="brand-mark"><span /></span>
            <span>KAPSUL</span>
          </a>
          <button className="icon-button" aria-label="Bantuan" onClick={() => setModal("help")}><CircleHelp size={20} /></button>
        </header>

        <div className={`app-content page-${tab}`}>
          {tab === "home" && <>
            <div className="welcome-row">
              <div><p className="eyebrow">SENIN, 23 NOVEMBER 2026</p><h1>Hai, Nabila! <span>✦</span></h1><p className="muted">Satu aksi kecil, satu perubahan besar.</p></div>
              <div className="avatar">N</div>
            </div>

            <button className="campus-select" onClick={() => setShowCampus(!showCampus)}>
              <span className="campus-pin"><MapPin size={15} /></span><span>{campus}</span><ChevronDown size={16} />
            </button>
            {showCampus && <div className="campus-menu">{["Kampus Tegalboto", "Kampus Bondowoso", "Kampus Lumajang"].map((item) => <button key={item} onClick={() => { setCampus(item); setShowCampus(false); }}>{item}{campus === item && <Check size={15} />}</button>)}</div>}

            <section className="air-card">
              <div className="air-top"><span className="live-dot" /> <span>KUALITAS UDARA AREA KAMPUS</span><span className="demo-label">SIMULASI</span></div>
              <div className="air-main"><div><strong>42</strong><span>µg/m³</span><p>PM2.5 • Sedang</p></div><div className="air-icon"><Wind size={31} /></div></div>
              <div className="air-scale"><span /></div><div className="air-foot"><span>Baik</span><span>Sedang</span><span>Tidak sehat</span></div>
            </section>

            <section className="drop-card">
              <div className="drop-copy"><span className="drop-kicker"><Sparkles size={13} /> WEEKLY DROP</span><h2>Energi penuh,<br />hadiah menunggu!</h2><p>Selesaikan misi untuk membuka kapsul kejutan minggu ini.</p><div className="drop-count"><Clock3 size={13} /> Reset dalam 2 hari 14 jam</div></div>
              <div className={"capsule-art " + (energy >= 100 ? "capsule-ready" : "")}><div className="capsule-glow" /><div className="capsule"><div className="cap-top"><Leaf size={22} /></div><div className="cap-bottom" /></div><Sparkles className="sparkle s1" size={17} /><Sparkles className="sparkle s2" size={12} /></div>
            </section>

            <section className="energy-card">
              <div className="section-head"><div><p className="eyebrow">PROGRES KAPSULMU</p><h3>Energi terkumpul</h3></div><strong className="energy-number">{energy}<small>/100</small></strong></div>
              <div className="energy-track"><span style={{ width: energy + "%" }} /></div>
              <div className="energy-foot"><span>{completed}/3 misi selesai</span><span>{energy >= 100 ? "Siap dibuka!" : 100 - energy + " energi lagi"}</span></div>
              <button className={"primary-button " + (energy >= 100 ? "gold-button" : "")} onClick={() => energy >= 100 ? openLoot() : setTab("missions")}>{energy >= 100 ? "PECAHKAN KAPSUL" : "LANJUTKAN MISI"} <ArrowRight size={17} /></button>
            </section>

            <div className="section-head impact-heading"><div><p className="eyebrow">DAMPAK BAIKMU</p><h3>Jejak perubahan</h3></div><span className="period-pill">Minggu ini</span></div>
            <div className="impact-grid">
              <div className="impact-card"><span className="impact-icon green"><Leaf size={18} /></span><strong>{(impact / 1000).toFixed(2)} kg</strong><p>Estimasi emisi dihindari</p><small><ArrowDownRight size={12} /> Terus bertumbuh</small></div>
              <div className="impact-card"><span className="impact-icon blue"><Zap size={18} /></span><strong>{completed * 1 + (opened ? 1 : 0)} aksi</strong><p>Aksi ramah lingkungan</p><small><Activity size={12} /> Kamu keren!</small></div>
            </div>
            <p className="disclaimer">*Angka dampak dan kualitas udara merupakan data simulasi untuk demonstrasi.</p>
          </>}

          {tab === "missions" && <>
            <div className="page-intro"><p className="eyebrow">LEVEL UP YOUR IMPACT</p><h1>Misi hari ini <span>✦</span></h1><p className="muted">Pilih aksi yang bisa kamu lakukan hari ini.</p></div>
            <div className="mission-progress"><div><span className="eyebrow">PROGRES MISI</span><strong>{completed} dari 3 selesai</strong></div><div className="mini-progress"><span style={{ width: (completed / 3 * 100) + "%" }} /></div></div>
            {missions.map((mission) => <article className={"mission-card " + (mission.done ? "mission-done" : "")} key={mission.id}>
              <div className={"mission-icon m" + mission.id}>{mission.icon === "bike" ? <Bike /> : mission.icon === "leaf" ? <Leaf /> : <Share2 />}</div>
              <div className="mission-body"><span className="eyebrow">{mission.tag}</span><h3>{mission.title}</h3><p>{mission.subtitle}</p><strong className="reward-text">{mission.reward}</strong></div>
              {mission.done ? <span className="done-check"><Check size={17} /></span> : <span className="mission-number">0{mission.id}</span>}
              {mission.id === 1 && !mission.done && <div className="mission-action wide-action"><div className="distance-row"><span>Jarak simulasi</span><strong>{distance.toFixed(1)} / 3,2 km</strong></div><input aria-label="Jarak tempuh" type="range" min="0" max="3.2" step="0.1" value={distance} onChange={(e) => setDistance(Number(e.target.value))} /><div className="distance-foot"><span>Kecepatan: 5,4 km/jam</span><span>Anti-motor challenge</span></div><button className="outline-button" onClick={() => completeMission(1)} disabled={distance < 3.2}> {distance < 3.2 ? "Simulasikan perjalanan penuh" : "Klaim energi"} <ArrowRight size={15} /></button></div>}
              {mission.id === 2 && !mission.done && <div className="mission-action wide-action"><label className="upload-box"><Camera size={18} /><span>{wasteFile || "Unggah foto sampah terpilah"}</span><input type="file" accept="image/*" onChange={(e) => setWasteFile(e.target.files?.[0]?.name || "")} /></label><button className="outline-button" onClick={() => completeMission(2)} disabled={!wasteFile}>Konfirmasi setoran <ArrowRight size={15} /></button></div>}
              {mission.id === 3 && !mission.done && <div className="mission-action wide-action"><div className="referral-code"><span>KODE REFERRAL</span><strong>KAPSUL-NABILA</strong><button onClick={copyReferral}><Copy size={14} /> {copied ? "Tersalin" : "Salin"}</button></div><button className="outline-button" onClick={() => completeMission(3)}>Tandai sudah dibagikan <ArrowRight size={15} /></button></div>}
            </article>)}
            <div className="tip-card"><span><ShieldCheck size={18} /></span><div><strong>Aksi nyata, dampak nyata.</strong><p>Pastikan kamu melakukan aktivitasnya. KAPSUL mengajak kita membangun kebiasaan, bukan sekadar mengumpulkan poin.</p></div></div>
          </>}

          {tab === "wallet" && <>
            <div className="page-intro"><p className="eyebrow">YOUR LITTLE TREASURES</p><h1>Dompet hadiah <span>✦</span></h1><p className="muted">Reward kecil untuk kebiasaan baikmu.</p></div>
            <div className="wallet-summary"><div className="wallet-orb"><Wallet size={23} /></div><div><span className="eyebrow">TOTAL REWARD AKTIF</span><h2>Rp5.000</h2><p>1 voucher siap digunakan</p></div><div className="wallet-decoration">✳</div></div>
            <div className="section-head"><div><p className="eyebrow">PUNYAMU</p><h3>Voucher tersedia</h3></div><span className="period-pill">2 reward</span></div>
            {vouchers.map((voucher, i) => <article className={"voucher-card " + voucher.tone} key={voucher.code}><div className="voucher-left"><span className="voucher-brand">{voucher.brand}</span><h3>{voucher.title}</h3><p>{voucher.expiry}</p><span className="voucher-code">{voucher.code}</span></div><button className="qr-button" onClick={() => setModal("receipt")} aria-label="Lihat kode voucher"><QrCode size={27} /></button><span className="voucher-notch top" /><span className="voucher-notch bottom" /></article>)}
            <button className="receipt-button" onClick={() => setModal("receipt")}><span><Ticket size={18} /></span><div><strong>Struk dampak digital</strong><small>Lihat ringkasan kontribusimu</small></div><ArrowRight size={18} /></button>
            <div className="wallet-note"><Gift size={18} /><p>Lebih banyak aksi, lebih banyak kejutan. Selesaikan misi untuk mengisi kapsul berikutnya!</p></div>
          </>}
        </div>

        <nav className="bottom-nav">
          <button className={tab === "home" ? "active" : ""} onClick={() => setTab("home")}><span><Activity size={20} /></span><small>Home</small></button>
          <button className={tab === "missions" ? "active" : ""} onClick={() => setTab("missions")}><span><Zap size={20} /></span><small>Misi</small>{completed < 3 && <i />}</button>
          <button className={tab === "wallet" ? "active" : ""} onClick={() => setTab("wallet")}><span><Wallet size={20} /></span><small>Dompet</small></button>
        </nav>
      </div>

      {modal && <div className="modal-backdrop" onClick={() => setModal(null)}>
        <section className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setModal(null)}><X size={19} /></button>
          {modal === "help" ? <div className="receipt-content"><div className="receipt-icon"><CircleHelp size={24} /></div><span className="eyebrow">PUSAT BANTUAN</span><h2>Butuh bantuan?</h2><p className="muted">KAPSUL adalah prototipe demo. Data kualitas udara, jarak, dan dampak masih berupa simulasi.</p><div className="receipt-line"><span>Navigasi</span><strong>Pilih Home, Misi, atau Dompet</strong></div><div className="receipt-line"><span>Misi</span><strong>Ikuti petunjuk lalu klaim energi</strong></div><button className="primary-button" onClick={() => setModal(null)}>Mengerti <ArrowRight size={17} /></button></div> : modal === "loot" ? <div className={"loot-content " + (bursting ? "is-bursting" : "")}>
            {!opened ? <><div className="loot-kicker"><Sparkles size={15} /> WEEKLY SURPRISE</div><div className={"loot-capsule " + (bursting ? "loot-capsule-burst" : "")}><div className="loot-top"><Leaf size={28} /></div><div className="loot-bottom" /></div><h2>Ada kejutan<br />di dalam kapsul!</h2><p>Siap melihat hadiah dari aksi baikmu minggu ini?</p><button className="primary-button gold-button" onClick={triggerCapsuleOpen} disabled={bursting}>BUKA KAPSULKU <Sparkles size={17} /></button></> :
            <><div className={"reward-reveal " + (rewardVisible ? "visible" : "")}><div className="confetti">✦　✧　✳　✦　✧</div><div className="reward-medal"><Gift size={34} /></div><span className="eyebrow">SELAMAT, ENVIRONMENT HERO!</span><h2>Kamu dapat hadiah!</h2><div className="reward-ticket"><span>VOUCHER PARTNER</span><strong>Rp5.000</strong><small>KODE: KAPSUL5K</small></div><div className="reward-stats"><div><strong>+Rp12.000</strong><span>estimasi hemat</span></div><div><strong>-45 g</strong><span>estimasi PM2.5*</span></div></div><p className="reward-disclaimer">*Hadiah dan angka dampak adalah simulasi prototipe.</p><button className="primary-button" onClick={() => { setSaved(true); setTab("wallet"); setModal(null); }}>{saved ? "TERSIMPAN" : "SIMPAN KE DOMPET"} <Wallet size={17} /></button><button className="share-button" onClick={() => { if (navigator.share) navigator.share({ title: "KAPSUL", text: "Aku baru menyelesaikan misi ramah lingkungan di KAPSUL!" }).catch(() => undefined); else copyReferral(); }}><Share2 size={16} /> Bagikan pencapaian</button></div></>}
          </div> : <div className="receipt-content"><div className="receipt-icon"><Ticket size={24} /></div><span className="eyebrow">KAPSUL DIGITAL RECEIPT</span><h2>Struk dampakmu</h2><p className="muted">23 November 2026 • Minggu ke-47</p><div className="cashier-live"><span><i /> LIVE · LAYAR AKTIF</span><strong>{liveTime}</strong></div><div className="receipt-line"><span>Misi diselesaikan</span><strong>{completed} / 3</strong></div><div className="receipt-line"><span>Energi terkumpul</span><strong>{energy} / 100</strong></div><div className="receipt-line"><span>Estimasi emisi dihindari</span><strong>{impact} g</strong></div><div className="receipt-total"><span>STATUS KONTRIBUSI</span><strong>{completed ? "Terus bertumbuh 🌱" : "Mulai langkah pertamamu"}</strong></div><p className="receipt-disclaimer">Data ini merupakan ilustrasi simulasi, bukan sertifikat pengukuran lingkungan.</p><button className="primary-button" onClick={() => setModal(null)}>KEMBALI <ArrowRight size={17} /></button></div>}
        </section>
      </div>}
    </main>
  );
}