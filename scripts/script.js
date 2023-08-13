const contentDiv = document.getElementById("content");

const springbootSVG =
  `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="IconChangeColor" height="20" width="20"><title>Spring Boot</title>
  <path class="spring" d="m23.693 10.7058-4.73-8.1844c-.4094-.7106-1.4166-1.2942-2.2402-1.2942H7.2725c-.819 0-1.8308.5836-2.2402 1.2942L.307 10.7058c-.4095.7106-.4095 
  1.873 0 2.5837l4.7252 8.189c.4094.7107 1.4166 1.2943 2.2402 1.2943h9.455c.819 0 1.826-.5836 2.2402-1.2942l4.7252-8.189c.4095-.7107.4095-1.8732 
  0-2.5838zM10.9763 5.7547c0-.5365.4377-.9742.9742-.9742s.9742.4377.9742.9742v5.8217c0 .5366-.4377.9742-.9742.9742s-.9742-.4376-.9742-.9742zm.9742 
  12.4294c-3.6427 0-6.6077-2.965-6.6077-6.6077.0047-2.0896.993-4.0521 2.6685-5.304a.8657.8657 0 0 1 1.2142.1788.8657.8657 0 0 1-.1788 1.2143c-2.1602 
  1.6048-2.612 4.6592-1.0072 6.8194 1.6049 2.1603 4.6593 2.612 6.8195 1.0072 1.2378-.9177 1.9673-2.372 1.9673-3.9157a4.8972 4.8972 0 0 
  0-1.9861-3.925c-.386-.2824-.466-.8284-.1836-1.2143.2824-.386.8283-.466 1.2143-.1835 1.6895 1.2471 2.6826 3.2238 2.6873 5.3228 0 3.6474-2.965 6.6077-6.6077 
  6.6077z" id="mainIconPathAttribute" fill="green"></path></svg>`;

const aboutContent = `
  <div class="container">
    <div class="row">
      <div class="col-lg-6">
        <h1>About Me</h1>
        <p>I'm Suriya An enthusiastic web developer and design. 
        I have a strong interest in creating user-friendly websites. 
        I love to explore the latest technologies and continuously improve my skills to deliver solutions. 
        I also have a experience in working in java and springboot as well.</p>
      </div>
      <div class="col-lg-6">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Profile Image" class="img-fluid rounded-circle">
      </div>
    </div>
  </div>
`;

const projectsContent = `
  <div class="container">
    <h1 class="mb-4">Projects</h1>
    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-body">
            <h3 class="card-title">Portfolio Website</h3>
            <p class="card-text">A personal portfolio website showcasing my skills, projects, and contact information. Built using HTML, CSS, and JavaScript.</p>
          </div>
        </div>
      </div>
      <!-- Add more project cards as needed -->
    </div>
  </div>
`;

const skillsContent = `
<div class="container">
  <h3 class="mb-4">Languages</h3>
  <div class="row">
    <div class="col skill-item html"><i class="fab fa-html5"></i> HTML</div>
    <div class="col skill-item css"><i class="fa-brands fa-css3-alt"></i> CSS</div>
    <div class="w-100"></div>
    <div class="col skill-item js"><i class="fa-brands fa-js"></i> Javascript</div>
    <div class="col skill-item angular"><i class="fa-brands fa-angular"></i> Angular</div>
    <div class="w-100"></div>
    <div class="col skill-item java"><i class="fa-brands fa-java"></i> JAVA</div>
  </div><br><br>
  <h3 class="mb-4">Framework</h3>
  <div class="row">
    <div class="col skill-item angular"><i class="fa-brands fa-angular"></i> Angular Material</div>
    <div class="col skill-item bootstrap"><i class="fa-brands fa-bootstrap"></i> Bootstrap</div>
    <div class="w-100"></div>
    <div class="col skill-item spring">${springbootSVG} SpringBoot</div>
  </div><br><br>
  <h3 class="mb-4">Tools</h3>
  <div class="row">
    <div class="col skill-item "><i class="fab fa-github"></i> Github</div>
    <div class="col skill-item git"><i class="fa-brands fa-git-alt"></i> Git</div>
    <div class="w-100"></div>
    <div class="col skill-item jenkins"><i class="fa-brands fa-jenkins"></i> Jenkins</div>
    <div class="col skill-item others"><i><b>S</b></i> Subversion</div>
  </div>
</div>
`;

const contactContent = `
  <div class="container">
    <h1 class="mb-4">Contact</h1>
    <p>
      Feel free to connect with me on <a href="https://www.linkedin.com/in/ssuriya1/" target="_blank">LinkedIn</a>.<br><br>
      In case of call or email, provide the details and reason to contant.
    </p>
    <form id="contactForm">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input autocomplete='off' type="text" class="form-control" id="name" name="name" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input autocomplete='off' type="email" class="form-control" id="email" name="email" required>
      </div>
      <div class="mb-3">
        <label for="reason" class="form-label">Reason for Contact</label>
        <textarea class="form-control" id="reason" name="reason" rows="4" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
`;

const ECAContent = `
  <h2>Extra Curricular Activities</h2>
  <p>Member of a NGO for helping for the studies of childrens.</p>
  <p>Volunteered on NGO activities to help the childrens and homes.</p>
`;

const displayContentWithFadeIn = (content, delay) => {
  setTimeout(() => {
    contentDiv.style.opacity = "0";
    setTimeout(() => {
      contentDiv.innerHTML = content;
      contentDiv.style.opacity = "1";
    }, 500);
  }, delay);
};

displayContentWithFadeIn(skillsContent, 500);

document.getElementById("about").addEventListener("click", () => {
  displayContentWithFadeIn(aboutContent, 1000);
});

document.getElementById("projects").addEventListener("click", () => {
  displayContentWithFadeIn(projectsContent, 1000);
});

document.getElementById("skills").addEventListener("click", () => {
  displayContentWithFadeIn(skillsContent, 1000);
});

document.getElementById("contact").addEventListener("click", () => {
  displayContentWithFadeIn(contactContent, 1000);
});

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    target.scrollIntoView({ behavior: "smooth" });
  });
});

const nameAnimationContainer = document.getElementById(
  "name-animation-container"
);
const portfolioContent = document.getElementById("portfolio-content");

// setTimeout(() => {
//   nameAnimationContainer.style.opacity = 0;
//   setTimeout(() => {
//     nameAnimationContainer.style.display = "none";
//     portfolioContent.style.opacity = 1;
//   }, 1000);
// }, 3000);

// Handle form submission
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);

  // You can customize the email content here
  const emailContent = `
    Name: ${formData.get("name")}
    Email: ${formData.get("email")}
    Reason for Contact: ${formData.get("reason")}
  `;

  contactForm.reset();
});
