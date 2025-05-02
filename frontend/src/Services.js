import React from "react";
import "./styles.css";

const serviceData = [
  {
    icon: "✂️",
    title: "Haircut",
    description: ["Precision haircuts tailored to your style. ($25)", "Kids under 12. ($15)"],
  },
  {
    icon: "🪒",
    title: "Haircut + Beard Trim",
    description: ["Neat and clean beard grooming. ($30)"],
  },
  {
    icon: "💈",
    title: "Hot Towel Shave",
    description: ["A relaxing, smooth shave with a hot towel. ($20)"],
  },
  {
    icon: "🧖‍♂️",
    title: "Scalp Massage",
    description: ["Revitalize your scalp with a deep massage. ($10)"],
  },
];

function Services() {
  return (
    <div className="container">
      <h1>Our Services</h1>
      <p>We offer a variety of high-quality grooming services. All prices marked here are final.</p>

      <div className="service-list">
        {serviceData.map((service, index) => (
          <div className="service-item" key={index}>
            <h3>{service.icon} {service.title}</h3>
            {service.description.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;