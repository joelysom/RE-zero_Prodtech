import Hero from "../../components/Hero.jsx";
import Services from "./components/Services.jsx";
import Productivity from "./components/Productivity.jsx";
import SocialMedia from "./components/SocialMedia.jsx";

const Home = () => {
  return (
    <>
      <div>
        <Hero />
        <Services />
        <Productivity />
        <SocialMedia />
      </div>
    </>
  );
};

export default Home;
