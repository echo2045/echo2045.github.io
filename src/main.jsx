
import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import "./project-folder.css";
import ProjectFolder from "./ProjectFolder.jsx";

const gameStats = [
["Updating and Maintaining","10M+","Downloads Scale Game"],
["Contributed to","~1M","New Downloads"],
["Published","1","IEEE Research Paper on Serious Games"],
["","3","Games Live"],
["","2","Upcoming Games"]
];

const esportsStats = [
["Organised","10+","Online Tournaments"],
["Organised","5+","LAN Tournaments"],
["Supported","500+","Players Supported"],
["Managed","24+","Competitive Teams Managed"],
["Hosted","2","National Qualifiers Hosted"],
["","","Organised National Team Participation in International Events"]
];

function Card({data}) {
 return (
  <div className="statCard">
    <div className="top">{data[0]}</div>
    <div className="number">{data[1]}</div>
    <div className="bottom">{data[2]}</div>
  </div>
 );
}

function CardContainer({title,items,side}) {
 return (
  <div className={"cardContainer "+side}>
    <h2>{title}</h2>
    <div className="cards">
      {items.map((item,index)=><Card key={index} data={item}/>)}
    </div>
  </div>
 );
}

function App(){
 return (
  <main>
   <section className="hero">
    <h1>Nafis Forkan</h1>
    <h3>Game Developer</h3>
    <p>Gameplay Programmer • Unity • Unreal Engine • Game Systems</p>
    <div className="divider"></div>
    <p>Building games, gameplay systems, and player-focused experiences.</p>
   </section>

   <section className="achievementArea">
    <CardContainer title="Game Development Milestones" items={gameStats} side="left"/>
    <CardContainer title="Esports Milestones" items={esportsStats} side="right"/>
   </section>

   <ProjectFolder/>
  </main>
 );
}

createRoot(document.getElementById("root")).render(<App/>);
