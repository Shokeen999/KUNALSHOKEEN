const html = document.documentElement;
const canvas = document.getElementById("scroll-canvas");
const context = canvas.getContext("2d");

const frameCount = 240;
const currentFrame = index => (
  `./frames/frame_${index.toString().padStart(6, '0')}.jpg`
);

const images = [];
let imagesLoaded = 0;
let currentFrameIndex = 0;

function updateCanvasSize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  context.scale(dpr, dpr);
  renderFrame(currentFrameIndex);
}

function renderFrame(index) {
  let img = images[index];
  
  if (!img || !img.complete || img.naturalWidth === 0) {
    for (let offset = 1; offset < frameCount; offset++) {
      const prev = images[index - offset];
      if (prev && prev.complete && prev.naturalWidth > 0) {
        img = prev;
        break;
      }
      const next = images[index + offset];
      if (next && next.complete && next.naturalWidth > 0) {
        img = next;
        break;
      }
    }
  }

  if (!img || !img.complete || img.naturalWidth === 0) return;
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;
  
  const imgRatio = imgWidth / imgHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  
  let drawWidth, drawHeight, offsetX, offsetY;
  if (canvasRatio > imgRatio) {
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  } else {
    drawWidth = canvasHeight * imgRatio;
    drawHeight = canvasHeight;
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  }
  
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
  img.onload = () => {
    imagesLoaded++;
    if (i === 1 || imagesLoaded === 1) {
      updateCanvasSize();
    } else {
      renderFrame(currentFrameIndex);
    }
  };
}

window.addEventListener('resize', updateCanvasSize);

let ticking = false;

window.addEventListener('scroll', () => {  
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollTop = html.scrollTop || document.body.scrollTop;
      const maxScrollTop = (html.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      
      if (maxScrollTop > 0) {
        const scrollFraction = scrollTop / maxScrollTop;
        const frameIndex = Math.min(
          frameCount - 1,
          Math.max(0, Math.floor(scrollFraction * frameCount))
        );
        
        if (frameIndex !== currentFrameIndex) {
          currentFrameIndex = frameIndex;
          renderFrame(currentFrameIndex);
        }
      }
      ticking = false;
    });
    ticking = true;
  }
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  updateCanvasSize();
  initInteractiveFeatures();
} else {
  window.addEventListener('DOMContentLoaded', () => {
    updateCanvasSize();
    initInteractiveFeatures();
  });
}

/* ==========================================================================
   INTERACTIVE FEATURES LOGIC
   ========================================================================== */

function initInteractiveFeatures() {
  initScrollProgress();
  initCounterAnimations();
  initROICalculator();
  initImpactToggle();
  initCategoryFilters();
  initTimelineModal();
  initQAAssistant();
}

// 1. Scroll Progress Bar
function initScrollProgress() {
  const scrollProgressBar = document.getElementById('scroll-progress');
  if (!scrollProgressBar) return;
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgressBar.style.width = scrolled + '%';
  });
}

// 2. Animated Number Counters
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'), 10);
        const prefix = entry.target.getAttribute('data-prefix') || '';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        const duration = 1800;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.innerText = prefix + Math.floor(current).toLocaleString() + suffix;
        }, stepTime);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

// 3. Quality ROI & Efficiency Impact Calculator
function initROICalculator() {
  const sliderAudits = document.getElementById('roi-audits');
  const sliderDefects = document.getElementById('roi-defects');
  const sliderTeam = document.getElementById('roi-team');

  const valAudits = document.getElementById('val-audits');
  const valDefects = document.getElementById('val-defects');
  const valTeam = document.getElementById('val-team');

  const outReduction = document.getElementById('out-reduction');
  const outHours = document.getElementById('out-hours');
  const outCsat = document.getElementById('out-csat');
  const outCompliance = document.getElementById('out-compliance');

  if (!sliderAudits) return;

  function calculate() {
    const audits = parseInt(sliderAudits.value, 10);
    const defectRate = parseFloat(sliderDefects.value);
    const team = parseInt(sliderTeam.value, 10);

    valAudits.innerText = audits.toLocaleString();
    valDefects.innerText = defectRate + '%';
    valTeam.innerText = team;

    // Governance reduces baseline defect leakage by ~65%
    const newDefectRate = (defectRate * 0.35).toFixed(1);
    const defectReduction = Math.round(100 - (newDefectRate / defectRate) * 100);

    // Coaching & process improvements save ~4.5 mins per defect avoided
    const defectsPrevented = Math.round(audits * (defectRate / 100) * (defectReduction / 100));
    const hoursSaved = Math.round((defectsPrevented * 4.5) / 60 + team * 2.5);

    const csatLift = (defectReduction * 0.22).toFixed(1);
    const complianceScore = (100 - newDefectRate).toFixed(1);

    outReduction.innerText = '-' + defectReduction + '%';
    outHours.innerText = '~' + hoursSaved + ' hrs';
    outCsat.innerText = '+' + csatLift + ' pts';
    outCompliance.innerText = complianceScore + '%';
  }

  [sliderAudits, sliderDefects, sliderTeam].forEach(s => {
    if (s) s.addEventListener('input', calculate);
  });
  calculate();
}

// 4. Before / After Impact Toggle
function initImpactToggle() {
  const btnBefore = document.getElementById('btn-impact-before');
  const btnAfter = document.getElementById('btn-impact-after');
  const cardContainer = document.getElementById('impact-content');

  if (!btnBefore || !btnAfter || !cardContainer) return;

  const dataBefore = [
    { title: "Defect & Error Rate", text: "14% - 18% unmonitored defect leakage in customer interactions.", type: "before" },
    { title: "Agent Calibration", text: "Inconsistent evaluation standards across different team auditors.", type: "before" },
    { title: "Customer Pain Points", text: "Reactive handling of customer complaints without root cause analysis.", type: "before" },
    { title: "Compliance Score", text: "Average ~82% compliance due to process gaps and lack of refresher training.", type: "before" }
  ];

  const dataAfter = [
    { title: "Defect & Error Rate", text: "Sub-3% defect rate with 100% audit accuracy & early intervention.", type: "after" },
    { title: "Agent Calibration", text: "100% calibrated audit scoring with standardized SOP rubrics.", type: "after" },
    { title: "Customer Pain Points", text: "Proactive RCA & targeted training interventions improving CSAT.", type: "after" },
    { title: "Compliance Score", text: "Consistent 98%+ operational compliance across all Assisted Sales processes.", type: "after" }
  ];

  function render(items) {
    cardContainer.innerHTML = items.map(item => `
      <div class="impact-item ${item.type}">
        <h5>${item.type === 'before' ? '⚠️' : '✅'} ${item.title}</h5>
        <p>${item.text}</p>
      </div>
    `).join('');
  }

  btnBefore.addEventListener('click', () => {
    btnBefore.classList.add('active');
    btnAfter.classList.remove('active');
    render(dataBefore);
  });

  btnAfter.addEventListener('click', () => {
    btnAfter.classList.add('active');
    btnBefore.classList.remove('active');
    render(dataAfter);
  });

  render(dataAfter);
}

// 5. Category Filter Tabs
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterableItems = document.querySelectorAll('.filterable-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      filterableItems.forEach(item => {
        const cat = item.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

// 6. Career Timeline Modal
function initTimelineModal() {
  const modal = document.getElementById('timeline-modal');
  const modalContent = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close');
  const triggers = document.querySelectorAll('.btn-detail-modal');

  if (!modal || !modalContent) return;

  const modalData = {
    'lenskart': {
      title: "Assistant Manager – Quality | Lenskart",
      period: "Present • Gurgaon",
      highlights: [
        "Lead the entire Quality Audit and Compliance function for Assisted Sales LOB.",
        "Manage Customer Happiness Quality, monitoring customer complaints, defect trends, and journey friction.",
        "Conduct regular calibration & feedback sessions with operations and training leads.",
        "Delivered a 25% reduction in customer-impacting process defects."
      ],
      tools: ["Quality Governance", "Data Analytics", "CSAT Optimization", "L&D Calibration", "Process Excellence"]
    },
    'lenskart-sr': {
      title: "Senior Executive – Quality & Training | Lenskart",
      period: "Previous Role • Gurgaon",
      highlights: [
        "Audited transaction quality and conducted floor calibration sessions.",
        "Designed targeted coaching interventions for bottom-quartile advisors.",
        "Improved team SLA compliance from 88% to 96%."
      ],
      tools: ["Transaction Audits", "1-on-1 Coaching", "Root Cause Analysis", "SLA Improvement"]
    },
    'earlier-roles': {
      title: "Quality & CX Specialist | Earlier Journey",
      period: "Foundational Experience",
      highlights: [
        "Built core competencies in sales quality, transaction monitoring, and escalation management.",
        "Formulated audit checklists and conducted monthly advisor evaluations.",
        "Consistently recognized for top audit accuracy and domain expertise."
      ],
      tools: ["Call Auditing", "CSAT Surveys", "Compliance Checklists", "Agent Feedback"]
    }
  };

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-role');
      const data = modalData[key];
      if (!data) return;

      modalContent.innerHTML = `
        <h3 style="font-size: 1.5rem; color: #ffffff; margin-bottom: 0.3rem;">${data.title}</h3>
        <p style="color: #e85d04; font-weight: 600; font-size: 0.9rem; margin-bottom: 1.5rem;">${data.period}</p>
        <h4 style="color: #ffffff; font-size: 1.1rem; margin-bottom: 0.8rem;">Key Achievements & Governance Highlights:</h4>
        <ul style="color: #e2e8f0; line-height: 1.6; margin-bottom: 1.5rem; padding-left: 1.2rem;">
          ${data.highlights.map(h => `<li style="margin-bottom: 0.5rem;">${h}</li>`).join('')}
        </ul>
        <h4 style="color: #ffffff; font-size: 1rem; margin-bottom: 0.6rem;">Key Competencies & Tools:</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${data.tools.map(t => `<span class="tag" style="background: rgba(232,93,4,0.2); border: 1px solid #e85d04; color: #ffffff; font-size: 0.8rem; padding: 0.3rem 0.7rem; border-radius: 20px;">${t}</span>`).join('')}
        </div>
      `;
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

// 7. Floating Q&A Assistant Drawer
function initQAAssistant() {
  const trigger = document.getElementById('qa-bot-trigger');
  const drawer = document.getElementById('qa-bot-drawer');
  const closeBtn = document.getElementById('qa-drawer-close');
  const chatContainer = document.getElementById('qa-chat-content');
  const chips = document.querySelectorAll('.qa-prompt-chip');

  if (!trigger || !drawer) return;

  const responses = {
    'methodology': "<strong>Kunal's Quality Audit Methodology:</strong><br>1. <strong>Structured Sampling:</strong> Audit transactions across high-impact customer touchpoints.<br>2. <strong>Objective Rubrics:</strong> Eliminate evaluator bias through standardized calibration.<br>3. <strong>Root Cause Analysis (RCA):</strong> Categorize defects into process gaps vs skill gaps.<br>4. <strong>Closed-Loop Coaching:</strong> Convert audit findings into actionable 1-on-1 coaching.",
    'happiness': "<strong>Driving Customer Happiness Quality:</strong><br>Focuses on customer journey mapping, sentiment analysis, complaint trend identification, and continuous feedback loops to ensure high CSAT and reduced escalations.",
    'training': "<strong>Training & Calibration Framework:</strong><br>1. Identify floor skill gaps from audit trends.<br>2. Conduct bi-weekly calibration sessions with team leaders.<br>3. Deliver refresher modules & targeted coaching for low performers.<br>4. Track post-training performance lift.",
    'highlights': "<strong>Key Career Milestones:</strong><br>• <strong>7+ Years</strong> in Quality Governance & CX.<br>• Leads Quality & Compliance for <strong>Lenskart Assisted Sales LOB</strong>.<br>• Reduced customer-impacting defects by <strong>25%+</strong>.<br>• Trained & calibrated <strong>100+ advisors</strong>."
  };

  trigger.addEventListener('click', () => {
    drawer.classList.toggle('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => drawer.classList.remove('active'));
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.getAttribute('data-topic');
      const text = responses[topic];
      if (!text) return;

      chatContainer.innerHTML += `
        <div class="qa-chat-message" style="background: rgba(232, 93, 4, 0.2); border-color: rgba(232,93,4,0.4);">
          <strong>You asked:</strong> ${chip.innerText}
        </div>
        <div class="qa-chat-message">
          ${text}
        </div>
      `;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  });
}

