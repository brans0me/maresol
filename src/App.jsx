import { useState, useEffect } from "react";

var HERO_IMAGES = [
  { url: "/images/hero-sm-pier.jpg", label: "Santa Monica" },
  { url: "/images/hero-lb-canals.jpg", label: "Long Beach" },
  { url: "/images/hero-hollywood-palms.jpg", label: "Los Angeles" },
  { url: "/images/hero-silverlake-sign.jpg", label: "Silver Lake" },
  { url: "/images/hero-hollywood-sunset.jpg", label: "Hollywood" },
];

var PROPERTIES = [
  { id: "treetop", loc: "SM", name: "Light-Filled Tree-Top Getaway", type: "Guesthouse 1BR", area: "Santa Monica",
    desc: "Vaulted ceilings, ocean breezes, private patio. Walk to restaurants, yoga, and the beach.",
    guests: 2, price: 225, clean: 85, rate: 4.86, revs: 147, stay: "nightly", tax: 0.17,
    images: ["/images/SMupstairs-Outdoorspace.avif","/images/SMUpstairs - Bedroom.avif","/images/SMUpstairs - Kitchenette.avif","/images/smupstairsbathroom.avif","/images/SMupstairs.avif"] },
  { id: "mcm", loc: "SM", name: "MCM Studio with Patio", type: "Guesthouse 1BR", area: "Santa Monica",
    desc: "Beamed ceilings, sunny patio on a quiet tree-lined street near the Farmer's Market and beach.",
    guests: 2, price: 199, clean: 75, rate: 4.9, revs: 191, stay: "nightly", tax: 0.17,
    images: ["/images/SMdownstairs - Living Room.avif","/images/SMDownstairs - Bed.avif","/images/SMdownstairs-Kitchenette.avif","/images/SMdownstairs - Outdoorspace.avif","/images/smdownstairs - bathroom.avif"] },
  { id: "lbup", loc: "LB", name: "Beach Oasis - 2BR", type: "Apartment 2BR", area: "Belmont Heights, Long Beach",
    desc: "Renovated home near beaches, piers, and canals. Great for families and remote workers.",
    guests: 5, price: 165, clean: 100, monthly: 6217, rate: 4.87, revs: 67, stay: "both", tax: 0.12,
    images: ["/images/LBUpstairs - Living Room.avif","/images/LBUpstairs - Bedroom 1.avif","/images/LBUpstairs - Kitchen.avif","/images/LBUpstairs - Outdoor Patio.avif","/images/LBUpstairs - Bathroom.avif"] },
  { id: "lbdn", loc: "LB", name: "Beach Getaway Studio", type: "Studio", area: "Belmont Heights, Long Beach",
    desc: "Cozy studio, 10 min to beach and 2nd Street. 100% five-star long-term ratings.",
    guests: 2, price: 0, clean: 0, monthly: 3262, rate: 4.98, revs: 45, stay: "monthly", tax: 0.12,
    images: ["/images/LBdownstairs - Living.avif","/images/LBDownstairs-CouchtoBed.avif","/images/LBDownstairs-Kitchen.avif","/images/LBdownstairs - bathroom.avif","/images/LBDownstairs-Shower.avif"] },
  { id: "silver", loc: "SL", name: "Skyline Views - Silver Lake", type: "Studio", area: "Silver Lake, LA",
    desc: "Private patio with skyline views. Walkable Silver Lake. Clean, modern, smart home.",
    guests: 2, price: 135, clean: 65, rate: 5.0, revs: 3, stay: "nightly", tax: 0.14,
    images: ["/images/Silverlake - View of DTLA.avif","/images/Silverlake - Private Patio.avif","/images/Silverlake - Kitchen.avif","/images/Silverlake - Side 1.avif","/images/Silverlake - bathroom 1.avif"] },
];

var REVIEWS = [
  { name: "Claire", prop: "Tree-Top Getaway", text: "Comfortable and peaceful. Flexible checkout. Would stay again!" },
  { name: "Juliana", prop: "MCM Studio", text: "Very clean. Super helpful and responsive. Highly recommend." },
  { name: "Kristian", prop: "Beach Oasis", text: "Perfect Long Beach getaway. Easy check in. Heartbeat!" },
  { name: "Zuo", prop: "Skyline Studio", text: "Safe walkable streets. Clean, modern. Extremely friendly host!" },
];

var LOCATIONS = [{ id: "all", label: "All" },{ id: "SM", label: "Santa Monica" },{ id: "LB", label: "Long Beach" },{ id: "SL", label: "Silver Lake" }];
var MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var DAY_LABELS = ["S","M","T","W","T","F","S"];

function makeBookedSet(propertyId) {
  var booked = {};var seed = 0;
  for (var i = 0; i < propertyId.length; i++) seed = seed + propertyId.charCodeAt(i);
  var now = new Date();
  for (var j = 0; j < 90; j++) {
    var val = ((seed * 9301 + 49297 + j * 1327) % 233280) / 233280;
    if (val < 0.35) { var d = new Date(now.getTime()); d.setDate(d.getDate() + j); var key = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0"); booked[key] = true; }
  }
  return booked;
}

function formatDate(year, month, day) { return year + "-" + String(month+1).padStart(2,"0") + "-" + String(day).padStart(2,"0"); }

function calcPrice(prop, checkin, checkout) {
  if (!checkin || !checkout) return null;
  var nights = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
  if (nights <= 0) return null;
  var sub = prop.price * nights, cl = prop.clean || 0, tot = Math.round((sub + cl) * prop.tax), total = sub + cl + tot, saved = Math.round((sub + cl) * 0.14);
  return { nights: nights, sub: sub, cl: cl, tot: tot, total: total, saved: saved };
}

function StarIcon() { return <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.51L10 13.49l-4.94 2.63L6 10.61l-4-3.9 5.61-.87z" /></svg>; }

function HeroCarousel() {
  var st = useState(0); var idx = st[0]; var setIdx = st[1];
  useEffect(function() {
    var timer = setInterval(function() { setIdx(function(prev) { return (prev + 1) % HERO_IMAGES.length; }); }, 5000);
    return function() { clearInterval(timer); };
  }, []);
  function goPrev() { setIdx(function(prev) { return (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length; }); }
  function goNext() { setIdx(function(prev) { return (prev + 1) % HERO_IMAGES.length; }); }
  var arrowStyle = {position:"absolute",top:"50%",transform:"translateY(-50%)",zIndex:3,background:"rgba(0,0,0,0.3)",color:"#fff",border:"none",cursor:"pointer",width:48,height:48,borderRadius:"50%",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)",transition:"background 0.3s"};
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden"}}>
      {HERO_IMAGES.map(function(img, i) {
        return <div key={i} style={{
          position:"absolute",inset:0,
          backgroundImage:"url("+img.url+")",
          backgroundSize:"cover",backgroundPosition:"center",
          opacity: i === idx ? 1 : 0,
          transition:"opacity 1.8s ease-in-out",
          willChange:"opacity"
        }}/>;
      })}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(26,26,26,0.3) 0%,rgba(26,26,26,0.5) 50%,rgba(26,26,26,0.75) 100%)"}}/>
      <button className="hero-arrow" onClick={goPrev} style={Object.assign({},arrowStyle,{left:20})}>&#8249;</button>
      <button className="hero-arrow" onClick={goNext} style={Object.assign({},arrowStyle,{right:20})}>&#8250;</button>
      <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",display:"flex",justifyContent:"center",gap:10,zIndex:2}}>
        {HERO_IMAGES.map(function(img, i) {
          return <button key={i} onClick={function(){setIdx(i);}} style={{
            width: i === idx ? 32 : 10, height:10, borderRadius:5, border:"none", cursor:"pointer",
            background: i === idx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
            transition:"all 0.4s ease"
          }}/>;
        })}
      </div>
    </div>
  );
}

function PhotoGrid(props) {
  var images = props.images;
  var st = useState(0); var active = st[0]; var setActive = st[1];
  return (
    <div>
      <div style={{ width:"100%", aspectRatio:"4/3", borderRadius:4, overflow:"hidden", marginBottom:6 }}>
        <img src={images[active]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
      </div>
      <div style={{ display:"flex", gap:4 }}>
        {images.map(function(src, i) {
          return <div key={i} onClick={function(){ setActive(i); }} style={{ flex:1, aspectRatio:"1", borderRadius:3, overflow:"hidden", cursor:"pointer", opacity: i === active ? 1 : 0.5, outline: i === active ? "2px solid #1a1a1a" : "none", outlineOffset:1 }}>
            <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
          </div>;
        })}
      </div>
    </div>
  );
}

function Calendar(props) {
  var propertyId = props.propertyId; var checkin = props.checkin; var checkout = props.checkout; var onSelect = props.onSelect;
  var today = new Date(); var todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
  var ms = useState(today.getMonth()); var viewMonth = ms[0]; var setViewMonth = ms[1];
  var ys = useState(today.getFullYear()); var viewYear = ys[0]; var setViewYear = ys[1];
  var bs = useState(function() { return makeBookedSet(propertyId); }); var booked = bs[0];
  var daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
  var firstDay = new Date(viewYear, viewMonth, 1).getDay();
  var cells = [];
  for (var e = 0; e < firstDay; e++) cells.push({ day:0, key:"empty-"+e });
  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr = formatDate(viewYear, viewMonth, d);
    cells.push({ day:d, key:"d-"+d, dateStr:dateStr, isPast: dateStr < todayStr, isBooked: booked[dateStr] === true,
      isCI: dateStr === checkin, isCO: dateStr === checkout, isInRange: checkin && checkout && dateStr > checkin && dateStr < checkout,
      ok: dateStr >= todayStr && booked[dateStr] !== true });
  }
  function handleClick(dateStr) {
    if (!checkin || (checkin && checkout)) { onSelect(dateStr, null); }
    else if (dateStr <= checkin) { onSelect(dateStr, null); }
    else { var cur = new Date(checkin); cur.setDate(cur.getDate()+1); var end = new Date(dateStr); var blocked = false;
      while (cur < end) { var ck = cur.getFullYear()+"-"+String(cur.getMonth()+1).padStart(2,"0")+"-"+String(cur.getDate()).padStart(2,"0"); if(booked[ck]){blocked=true;break;} cur.setDate(cur.getDate()+1); }
      blocked ? onSelect(dateStr, null) : onSelect(checkin, dateStr); }
  }
  function getStyle(cell) {
    if (cell.isCI||cell.isCO) return {background:"#1a1a1a",color:"#FAF7F2",fontWeight:700,borderRadius:cell.isCI?"4px 0 0 4px":"0 4px 4px 0"};
    if (cell.isInRange) return {background:"rgba(58,107,138,0.15)",color:"#3a6b8a"};
    if (cell.ok) return {background:"rgba(139,174,196,0.08)",color:"#3a6b8a",cursor:"pointer"};
    if (cell.isBooked&&!cell.isPast) return {background:"rgba(196,139,139,0.1)",color:"#b08080"};
    return {color:"#ccc"};
  }
  return (
    <div style={{marginTop:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <button onClick={function(){if(viewMonth===0){setViewMonth(11);setViewYear(viewYear-1);}else{setViewMonth(viewMonth-1);}}} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,padding:4}}>{"<"}</button>
        <span style={{fontSize:12,fontWeight:600}}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button onClick={function(){if(viewMonth===11){setViewMonth(0);setViewYear(viewYear+1);}else{setViewMonth(viewMonth+1);}}} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,padding:4}}>{">"}</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,textAlign:"center"}}>
        {DAY_LABELS.map(function(label,idx){return <div key={"lbl-"+idx} style={{fontSize:9,color:"#8a8278",fontWeight:600,padding:2}}>{label}</div>;})}
        {cells.map(function(cell){if(cell.day===0)return <div key={cell.key}/>;var st=getStyle(cell);
          return <div key={cell.key} onClick={function(){if(cell.ok)handleClick(cell.dateStr);}} style={{fontSize:11,fontWeight:st.fontWeight||500,padding:"6px 0",borderRadius:st.borderRadius||3,background:st.background||"transparent",color:st.color||"#ccc",cursor:st.cursor||"default"}}>{cell.day}</div>;})}
      </div>
      <div style={{display:"flex",gap:10,marginTop:6,justifyContent:"center",fontSize:9,color:"#8a8278"}}>
        <span><span style={{display:"inline-block",width:7,height:7,borderRadius:2,background:"rgba(139,174,196,0.2)",marginRight:3,verticalAlign:"middle"}}/>Available</span>
        <span><span style={{display:"inline-block",width:7,height:7,borderRadius:2,background:"rgba(196,139,139,0.2)",marginRight:3,verticalAlign:"middle"}}/>Booked</span>
        <span><span style={{display:"inline-block",width:7,height:7,borderRadius:2,background:"#1a1a1a",marginRight:3,verticalAlign:"middle"}}/>Selected</span>
      </div>
      {checkin && <div style={{textAlign:"center",marginTop:6,fontSize:11,color:checkout?"#3a6b8a":"#8a8278",fontWeight:500}}>{checkout?checkin+" to "+checkout:"Now select check-out date"}</div>}
    </div>
  );
}

function PropertyCard(props) {
  var property = props.property; var onBook = props.onBook;
  var isMonthly = property.stay === "monthly";
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,marginBottom:56}} className="propgrid">
      <div><PhotoGrid images={property.images} /></div>
      <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#8a8278"}}>{property.type}</span>
          {isMonthly && <span style={{fontSize:9,fontWeight:600,color:"#8a5a3a",background:"rgba(196,168,130,0.15)",padding:"2px 6px"}}>MONTHLY ONLY</span>}
          {property.stay==="both" && <span style={{fontSize:9,fontWeight:600,color:"#3a6b8a",background:"rgba(139,174,196,0.12)",padding:"2px 6px"}}>NIGHTLY + MONTHLY</span>}
        </div>
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:21,fontWeight:700,color:"#1a1a1a",marginBottom:2}}>{property.name}</h3>
        <p style={{fontSize:11,color:"#8a8278",marginBottom:8}}>{property.area}</p>
        <p style={{fontSize:12,color:"#6b635a",lineHeight:1.7,marginBottom:12}}>{property.desc}</p>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <span style={{color:"#c4952a",display:"flex",alignItems:"center",gap:3}}><StarIcon/><b style={{color:"#1a1a1a",fontSize:13}}>{property.rate}</b></span>
          <span style={{fontSize:12,color:"#8a8278"}}>{property.revs} reviews</span>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {isMonthly ? (
            <span><span style={{fontFamily:"'Playfair Display',serif",fontSize:21,fontWeight:700}}>{"$"+property.monthly.toLocaleString()}</span><span style={{fontSize:12,color:"#8a8278",marginLeft:4}}>/ month</span></span>
          ) : (
            <span><span style={{fontFamily:"'Playfair Display',serif",fontSize:21,fontWeight:700}}>{"$"+property.price}</span><span style={{fontSize:12,color:"#8a8278",marginLeft:4}}>/ night</span></span>
          )}
          {!isMonthly && <span style={{fontSize:9,color:"#3a6b8a",background:"rgba(139,174,196,0.12)",padding:"2px 6px",fontWeight:600}}>SAVE ~14% VS AIRBNB</span>}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={function(){onBook(property,null,null);}} style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",padding:"11px 22px",background:"#1a1a1a",color:"#FAF7F2",border:"none",cursor:"pointer"}}>
            {isMonthly ? "Inquire" : "View Property"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingForm(props) {
  var selected = props.selected; var initCI = props.initCI; var initCO = props.initCO;
  var fs = useState({name:"",email:"",property:"",checkin:"",checkout:"",agree:false}); var form = fs[0]; var setForm = fs[1];
  var ds = useState(false); var done = ds[0]; var setDone = ds[1];
  useEffect(function(){if(selected){setForm(function(prev){return{name:prev.name,email:prev.email,property:selected.id,checkin:initCI||prev.checkin,checkout:initCO||prev.checkout,agree:prev.agree};});}}, [selected,initCI,initCO]);
  var prop = PROPERTIES.find(function(p){return p.id===form.property;});
  var isMonthly = prop && prop.stay === "monthly";
  var pricing = prop && !isMonthly ? calcPrice(prop, form.checkin, form.checkout) : null;
  if (done) return (<div style={{textAlign:"center",padding:40}}><div style={{fontSize:48}}>🎉</div><h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,marginTop:10}}>{isMonthly?"Inquiry Sent!":"Confirmed!"}</h3><p style={{fontSize:13,color:"#6b635a",marginTop:8}}>Brandon responds within an hour.</p></div>);
  var is = {fontFamily:"'DM Sans',sans-serif",fontSize:13,padding:"10px 12px",border:"1.5px solid rgba(0,0,0,0.1)",background:"#fff",outline:"none",width:"100%",color:"#1a1a1a"};
  var ls = {fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#8a8278",display:"block",marginBottom:4};
  function update(key,val){var next={};for(var k in form)next[k]=form[k];next[key]=val;setForm(next);}
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}} className="formgrid">
        <div><label style={ls}>Name *</label><input style={is} value={form.name} onChange={function(e){update("name",e.target.value);}}/></div>
        <div><label style={ls}>Email *</label><input style={is} type="email" value={form.email} onChange={function(e){update("email",e.target.value);}}/></div>
      </div>
      <div style={{marginBottom:12}}><label style={ls}>Property *</label>
        <select style={Object.assign({},is,{cursor:"pointer"})} value={form.property} onChange={function(e){update("property",e.target.value);}}>
          <option value="">Select a property</option>
          {PROPERTIES.map(function(p){return <option key={p.id} value={p.id}>{p.name}</option>;})}
        </select>
      </div>
      {!isMonthly && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}} className="formgrid">
        <div><label style={ls}>Check-in</label><input style={is} type="date" value={form.checkin} onChange={function(e){update("checkin",e.target.value);}}/></div>
        <div><label style={ls}>Check-out</label><input style={is} type="date" value={form.checkout} onChange={function(e){update("checkout",e.target.value);}}/></div>
      </div>}
      {pricing && <div style={{background:"rgba(139,174,196,0.06)",border:"1px solid rgba(139,174,196,0.15)",padding:14,marginBottom:14,fontSize:13,display:"flex",justifyContent:"space-between",fontWeight:700}}><span>Total</span><span>{"$"+pricing.total}</span></div>}
      <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:14}}>
        <input type="checkbox" checked={form.agree} onChange={function(e){update("agree",e.target.checked);}} style={{marginTop:3,width:16,height:16}}/>
        <span style={{fontSize:11,color:"#6b635a"}}>I agree to the Maresol Rental Agreement.</span>
      </div>
      <button onClick={function(){if(form.name&&form.email&&form.property&&form.agree)setDone(true);}} style={{width:"100%",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",padding:"14px 24px",background:"#1a1a1a",color:"#FAF7F2",border:"none",cursor:"pointer"}}>
        {isMonthly ? "Send Inquiry" : pricing ? "Book & Pay $"+pricing.total : "Book Instantly"}
      </button>
    </div>
  );
}

function ContactForm() {
  var fs = useState({name:"",email:"",message:""}); var form = fs[0]; var setForm = fs[1];
  var ds = useState(false); var sent = ds[0]; var setSent = ds[1];
  var is = {fontFamily:"'DM Sans',sans-serif",fontSize:13,padding:"10px 12px",border:"1.5px solid rgba(0,0,0,0.1)",background:"#fff",outline:"none",width:"100%",color:"#1a1a1a"};
  var ls = {fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#8a8278",display:"block",marginBottom:4,textAlign:"left"};
  function update(key,val){var next={};for(var k in form)next[k]=form[k];next[key]=val;setForm(next);}
  if (sent) return (<div style={{padding:32,background:"#fff",border:"1px solid rgba(0,0,0,0.06)"}}><div style={{fontSize:36,marginBottom:8}}>📬</div><h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>Message Sent!</h3><p style={{fontSize:13,color:"#6b635a",marginTop:6}}>I'll get back to you within an hour.</p></div>);
  return (
    <div style={{textAlign:"left"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}} className="formgrid">
        <div><label style={ls}>Name</label><input style={is} value={form.name} onChange={function(e){update("name",e.target.value);}}/></div>
        <div><label style={ls}>Email</label><input style={is} type="email" value={form.email} onChange={function(e){update("email",e.target.value);}}/></div>
      </div>
      <div style={{marginBottom:14}}><label style={ls}>Message</label><textarea style={Object.assign({},is,{minHeight:100,resize:"vertical"})} value={form.message} onChange={function(e){update("message",e.target.value);}}/></div>
      <button onClick={function(){if(form.name&&form.email&&form.message)setSent(true);}} style={{width:"100%",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",padding:"14px 24px",background:"#1a1a1a",color:"#FAF7F2",border:"none",cursor:"pointer"}}>Send Message</button>
    </div>
  );
}

export default function App() {
  var ls = useState("all"); var locFilter = ls[0]; var setLocFilter = ls[1];
  var ss = useState(null); var selectedProp = ss[0]; var setSelectedProp = ss[1];
  var ci = useState(""); var bookCI = ci[0]; var setBookCI = ci[1];
  var co = useState(""); var bookCO = co[0]; var setBookCO = co[1];
  var ms = useState(false); var menuOpen = ms[0]; var setMenuOpen = ms[1];
  function scrollTo(id){var el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth"});setMenuOpen(false);}
  var filtered = locFilter==="all" ? PROPERTIES : PROPERTIES.filter(function(p){return p.loc===locFilter;});
  function handleBook(prop,ci,co){setSelectedProp(prop);setBookCI(ci||"");setBookCO(co||"");scrollTo("book");}
  var navLinks = ["properties","about","book","contact"];

  return (
    <div style={{background:"#FAF7F2",minHeight:"100vh",fontFamily:"'DM Sans', sans-serif"}}>
      <style>{
        "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');"+
        "*{box-sizing:border-box;margin:0;padding:0}"+
        "@media(max-width:768px){.propgrid,.formgrid{grid-template-columns:1fr!important}.revgrid{grid-template-columns:1fr 1fr!important}.desktop-nav{display:none!important}.hamburger-btn{display:flex!important}.hero-arrow{top:75%!important;width:36px!important;height:36px!important;font-size:16px!important}.explore-indicator{font-size:9px!important}.explore-indicator svg{width:18px!important;height:18px!important}.hero-section{padding-top:70px!important;padding-bottom:40px!important}.hero-explore{bottom:36px!important}}"+
        "@media(min-width:769px){.mobile-menu{display:none!important}.hamburger-btn{display:none!important}.desktop-nav{display:flex!important}}"+
        "@keyframes bounceDown{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}"
      }</style>

      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(20,18,16,0.8)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span onClick={function(){scrollTo("hero");}} style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#FAF7F2",cursor:"pointer"}}>Maresol</span>
        <div className="desktop-nav" style={{display:"flex",gap:20}}>
          {navLinks.map(function(link){return <span key={link} onClick={function(){scrollTo(link);}} style={{fontSize:12,fontWeight:500,color:"rgba(250,247,242,0.7)",textTransform:"uppercase",cursor:"pointer",letterSpacing:"0.06em"}}>{link}</span>;})}
        </div>
        <button className="hamburger-btn" onClick={function(){setMenuOpen(!menuOpen);}} style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"none",flexDirection:"column",gap:5,width:28}}>
          <span style={{display:"block",width:"100%",height:2,background:"#FAF7F2",borderRadius:1,transition:"all 0.3s",transform:menuOpen?"rotate(45deg) translateY(7px)":"none"}}/>
          <span style={{display:"block",width:"100%",height:2,background:"#FAF7F2",borderRadius:1,transition:"all 0.3s",opacity:menuOpen?0:1}}/>
          <span style={{display:"block",width:"100%",height:2,background:"#FAF7F2",borderRadius:1,transition:"all 0.3s",transform:menuOpen?"rotate(-45deg) translateY(-7px)":"none"}}/>
        </button>
      </div>
      {menuOpen && <div className="mobile-menu" style={{position:"fixed",top:50,left:0,right:0,bottom:0,zIndex:99,background:"rgba(20,18,16,0.95)",backdropFilter:"blur(16px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:32}}>
        {navLinks.map(function(link){return <span key={link} onClick={function(){scrollTo(link);}} style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"#FAF7F2",cursor:"pointer",textTransform:"capitalize",letterSpacing:"0.02em"}}>{link}</span>;})}
      </div>}

      <section id="hero" className="hero-section" style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",padding:"100px 20px 80px",overflow:"hidden"}}>
        <HeroCarousel />
        <div style={{position:"relative",zIndex:2,maxWidth:560}}>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(48px,11vw,96px)",fontWeight:700,color:"#FAF7F2",marginBottom:18,lineHeight:1,textShadow:"0 2px 40px rgba(0,0,0,0.3)"}}>Maresol</h1>
          <p style={{fontSize:"clamp(15px,2.5vw,20px)",color:"rgba(250,247,242,0.9)",marginBottom:10,fontWeight:400}}>Curated stays across Los Angeles</p>
          <p style={{fontSize:13,color:"rgba(250,247,242,0.55)",maxWidth:420,margin:"0 auto 12px",lineHeight:1.7}}>Santa Monica, Long Beach, and Silver Lake.</p>
          <p style={{fontSize:13,color:"rgba(250,247,242,0.55)",maxWidth:420,margin:"0 auto 32px",lineHeight:1.7}}>Book directly and skip the Airbnb fees.</p>
          <button onClick={function(){scrollTo("properties");}} style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",padding:"15px 32px",background:"rgba(250,247,242,0.95)",color:"#1a1a1a",border:"none",cursor:"pointer"}}>Browse Properties</button>
          <div style={{display:"flex",justifyContent:"center",gap:28,marginTop:32}}>
            <div><span style={{fontSize:18,fontWeight:700,color:"#FAF7F2"}}>500+</span><p style={{fontSize:9,color:"rgba(250,247,242,0.5)",letterSpacing:"0.1em",marginTop:2}}>STAYS</p></div>
            <div style={{width:1,background:"rgba(250,247,242,0.2)"}}/>
            <div><span style={{fontSize:18,fontWeight:700,color:"#FAF7F2"}}>★ 4.9</span><p style={{fontSize:9,color:"rgba(250,247,242,0.5)",letterSpacing:"0.1em",marginTop:2}}>RATING</p></div>
            <div style={{width:1,background:"rgba(250,247,242,0.2)"}}/>
            <div><span style={{fontSize:18,fontWeight:700,color:"#FAF7F2"}}>5</span><p style={{fontSize:9,color:"rgba(250,247,242,0.5)",letterSpacing:"0.1em",marginTop:2}}>PROPERTIES</p></div>
          </div>
        </div>
        <div className="hero-explore" style={{position:"absolute",bottom:48,left:0,right:0,display:"flex",justifyContent:"center",zIndex:3}}>
          <div className="explore-indicator" onClick={function(){scrollTo("properties");}} style={{cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,animation:"bounceDown 2s ease-in-out infinite"}}>
            <span style={{fontSize:12,color:"rgba(250,247,242,0.45)",letterSpacing:"0.15em",textTransform:"uppercase"}}>Explore</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(250,247,242,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
      </section>

      <section id="properties" style={{padding:"70px 20px",maxWidth:1000,margin:"0 auto"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:700,textAlign:"center",marginBottom:8}}>Our Properties</h2>
        <div style={{display:"flex",justifyContent:"center",gap:6,margin:"16px 0 36px",flexWrap:"wrap"}}>
          {LOCATIONS.map(function(loc){return <button key={loc.id} onClick={function(){setLocFilter(loc.id);}} style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,padding:"7px 16px",cursor:"pointer",border:locFilter===loc.id?"1.5px solid #1a1a1a":"1.5px solid rgba(0,0,0,0.1)",background:locFilter===loc.id?"#1a1a1a":"transparent",color:locFilter===loc.id?"#FAF7F2":"#8a8278"}}>{loc.label}</button>;})}
        </div>
        {filtered.map(function(p){return <PropertyCard key={p.id} property={p} onBook={handleBook}/>;})}
      </section>

      <section id="reviews" style={{padding:"60px 20px",background:"#1a1a1a"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"#FAF7F2",textAlign:"center",marginBottom:32}}>What Guests Say</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}} className="revgrid">
            {REVIEWS.map(function(r,i){return (
              <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",padding:18}}>
                <div style={{display:"flex",gap:2,color:"#c4952a",marginBottom:6}}><StarIcon/><StarIcon/><StarIcon/><StarIcon/><StarIcon/></div>
                <p style={{fontSize:12,color:"rgba(250,247,242,0.8)",lineHeight:1.7,marginBottom:10}}>{r.text}</p>
                <div style={{fontSize:12,fontWeight:600,color:"#FAF7F2"}}>{r.name}</div>
                <div style={{fontSize:10,color:"#6b635a",marginTop:2}}>{r.prop}</div>
              </div>
            );})}
          </div>
        </div>
      </section>

      <section id="about" style={{padding:"80px 20px",background:"#F5F1EB"}}>
        <div style={{maxWidth:800,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:48,alignItems:"center"}} className="propgrid">
          <div>
            <div style={{width:"100%",aspectRatio:"1",borderRadius:6,overflow:"hidden",background:"#e8e3db"}}>
              <img src="/images/brandon-headshot.jpeg" alt="Brandon - Maresol host" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
            </div>
          </div>
          <div>
            <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"#8a8278",marginBottom:12}}>About Maresol</p>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"#1a1a1a",marginBottom:16,lineHeight:1.3}}>Hosting since 2012. Superhost every year since.</h2>
            <p style={{fontSize:13,color:"#6b635a",lineHeight:1.8,marginBottom:14}}>I started hosting on Airbnb over 13 years ago with a single guesthouse in Santa Monica. Today, Maresol is a curated collection of five properties across LA's best neighborhoods — each one personally designed, maintained, and managed by me.</p>
            <p style={{fontSize:13,color:"#6b635a",lineHeight:1.8,marginBottom:14}}>Every property is stocked with quality linens, fast Wi-Fi, and the kind of thoughtful touches that make you feel at home. I respond within an hour and I'm always available if you need anything during your stay.</p>
            <div style={{display:"flex",gap:24,marginTop:20}}>
              <div><span style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"#1a1a1a"}}>500+</span><p style={{fontSize:10,color:"#8a8278",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:2}}>Stays</p></div>
              <div><span style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"#1a1a1a"}}>4.9</span><p style={{fontSize:10,color:"#8a8278",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:2}}>Rating</p></div>
              <div><span style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"#1a1a1a"}}>13</span><p style={{fontSize:10,color:"#8a8278",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:2}}>Years</p></div>
              <div><span style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"#c4952a"}}>★</span><p style={{fontSize:10,color:"#8a8278",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:2}}>Superhost</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="book" style={{padding:"70px 20px",maxWidth:480,margin:"0 auto"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,textAlign:"center",marginBottom:6}}>Book Instantly</h2>
        <p style={{fontSize:13,color:"#8a8278",textAlign:"center",marginBottom:28}}>No platform fees. No middleman.</p>
        <BookingForm selected={selectedProp} initCI={bookCI} initCO={bookCO}/>
      </section>

      <section id="contact" style={{padding:"70px 20px",background:"#F5F1EB"}}>
        <div style={{maxWidth:600,margin:"0 auto",textAlign:"center"}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"#1a1a1a",marginBottom:6}}>Get in Touch</h2>
          <p style={{fontSize:13,color:"#8a8278",marginBottom:32,lineHeight:1.7}}>Questions about a property, availability, or long-term stays?</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:36}} className="formgrid">
            <a href="mailto:hello@maresol.com" style={{textDecoration:"none",background:"#fff",padding:28,border:"1px solid rgba(0,0,0,0.06)",cursor:"pointer",transition:"box-shadow 0.2s",display:"block"}}>
              <div style={{fontSize:24,marginBottom:10}}>✉️</div>
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#8a8278",marginBottom:4}}>Email</p>
              <p style={{fontSize:14,color:"#1a1a1a",fontWeight:600}}>hello@maresol.com</p>
            </a>
            <a href="tel:4153610175" style={{textDecoration:"none",background:"#fff",padding:28,border:"1px solid rgba(0,0,0,0.06)",cursor:"pointer",transition:"box-shadow 0.2s",display:"block"}}>
              <div style={{fontSize:24,marginBottom:10}}>📱</div>
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#8a8278",marginBottom:4}}>Text or Call</p>
              <p style={{fontSize:14,color:"#1a1a1a",fontWeight:600}}>415-361-0175</p>
            </a>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer style={{padding:"40px 20px 28px",background:"#141210"}}>
        <div style={{maxWidth:800,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:24,marginBottom:24}}>
          <div>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#FAF7F2",display:"block",marginBottom:8}}>Maresol</span>
            <p style={{fontSize:11,color:"#6b635a",lineHeight:1.7}}>Curated stays across Los Angeles.<br/>Santa Monica | Long Beach | Silver Lake</p>
          </div>
          <div style={{display:"flex",gap:20}}>
            <span onClick={function(){scrollTo("properties");}} style={{fontSize:11,color:"#6b635a",cursor:"pointer"}}>Properties</span>
            <span onClick={function(){scrollTo("about");}} style={{fontSize:11,color:"#6b635a",cursor:"pointer"}}>About</span>
            <span onClick={function(){scrollTo("book");}} style={{fontSize:11,color:"#6b635a",cursor:"pointer"}}>Book</span>
            <span onClick={function(){scrollTo("contact");}} style={{fontSize:11,color:"#6b635a",cursor:"pointer"}}>Contact</span>
          </div>
        </div>
        <div style={{maxWidth:800,margin:"0 auto",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:16,textAlign:"center"}}>
          <span style={{fontSize:10,color:"#4a4540"}}>© 2026 Maresol. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
