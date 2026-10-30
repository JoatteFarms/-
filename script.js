JavaScript
// 구글 로그인 응답 처리 함수
function handleCredentialResponse(response) {
  // JWT 토큰 디코딩 (사용자 정보 추출)
  const responsePayload = parseJwt(response.credential);

  const googleId = responsePayload.sub;
  const userName = responsePayload.name;
  const userEmail = responsePayload.email;
  const userPicture = responsePayload.picture;

  // 브라우저 세션에 로그인 상태 저장
  sessionStorage.setItem('joatte_user_name', userName);
  sessionStorage.setItem('joatte_user_pic', userPicture);

  // UI 업데이트
  updateLoginUI(userName, userPicture);
}

// JWT 토큰 파싱 헬퍼 함수
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('0041' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

// 로그인 상태에 따른 화면 변경 함수
function updateLoginUI(name, picture) {
  const googleBtn = document.getElementById('g_id_onload').parentElement; // 구글 로그인 버튼 묶음
  const userProfile = document.getElementById('user-profile');
  const userNameSpan = document.getElementById('user-name');
  const userAvatar = document.getElementById('user-avatar');

  if (name) {
    if (googleBtn) googleBtn.style.display = 'none';
    if (userProfile) {
      userNameSpan.textContent = name + '님';
      userAvatar.src = picture;
      userProfile.style.display = 'flex';
    }
  } else {
    if (googleBtn) googleBtn.style.display = 'block';
    if (userProfile) userProfile.style.display = 'none';
  }
}

// 로그아웃 버튼 이벤트 처리
document.addEventListener('DOMContentLoaded', () => {
  // 페이지 로드 시 기존 로그인 상태 확인
  const savedName = sessionStorage.getItem('joatte_user_name');
  const savedPic = sessionStorage.getItem('joatte_user_pic');
  if (savedName) {
    updateLoginUI(savedName, savedPic);
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('joatte_user_name');
      sessionStorage.removeItem('joatte_user_pic');
      updateLoginUI(null, null);
      window.location.reload();
    });
  }
});
(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const backToTop = document.querySelector("#back-to-top");
  const year = document.querySelector("#year");

  if (year) year.textContent = new Date().getFullYear();

  // Reveal sections gently as they enter the viewport; content remains visible if JS is unavailable.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      ".intro-copy, .intro-photo, .section-heading, .value-card, .crop-card, .paddy-content, .story-card, .channel-cta, .vision-inner, .contact-panel"
    );
    revealTargets.forEach((element, index) => {
      element.classList.add("reveal");
      if (element.matches(".value-card, .crop-card, .story-card")) {
        element.style.transitionDelay = `${(index % 3) * 90}ms`;
      }
    });
    document.documentElement.classList.add("reveal-ready");
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealTargets.forEach((element) => observer.observe(element));
  }


  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "메뉴 열기" : "메뉴 닫기");
      nav.classList.toggle("is-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "메뉴 열기");
        nav.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "메뉴 열기");
        menuButton.focus();
      }
    });
  }

  const updateBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("is-visible", window.scrollY > 420);
  };

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
})();
