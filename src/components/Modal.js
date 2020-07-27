import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const FunderLogo = props => (
  <a href={props.url} target="_blank" rel="noopener noreferrer">
    <img className="logo" src={props.path} alt={props.alt} />
  </a>
);

const LogoList = [
  {
    url: "https://www.uvic.ca/socialsciences/geography/index.php",
    path: "/images/uvic_logo_white.png",
    alt: "Logo for University of Victoria"
  },
  {
    url: "http://mitacs.ca/",
    path: "/images/mitacs.png",
    alt: "Logo for MITACS"
  },

  {
    url: "http://www.microsoft.com/",
    path: "/images/MSnewlogo.png",
    alt: "Logo for Microsoft"
  },

  {
    url: "https://www.digitalsupercluster.ca/",
    path: "/images/Supercluster_LogosFinals_CDTS_White_00-1.png",
    alt: "Logo for Canada's Digital Supercluster"
  },

  {
    url: "https://www.qvirt.com/",
    path: "/images/white_qvirt.png",
    alt: "Logo for QVirt"
  }
];

const IntroModal = props => (
  <Modal isOpen={props.show} toggle={props.toggle} className={props.className}>
    <ModalHeader toggle={props.toggle}>P3Aqua</ModalHeader>
    <ModalBody>
      <p>
        Welcome to P3Aqua - Preserve, Predict, and Protect our oceans! This is
        V0.1 of the Earth Data Store based Ocean application, built by the
        University of Victoria Mod Squad in collaboration with:
      </p>
      <div className="logos">
        {LogoList.map((logo, index) => (
          <FunderLogo
            url={logo.url}
            path={logo.path}
            alt={logo.alt}
            key={index}
          />
        ))}
      </div>
      <p>
        Special thanks to the European Space Agency for providing the data which
        makes this project possible.
      </p>
      <div className="esa">
        <a
          href="https://www.esa.int/ESA"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/images/eesa_logo_white.png"
            alt="Logo for European Space Agency"
          />
        </a>
      </div>
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={props.toggle}>
        View Map
      </Button>{" "}
    </ModalFooter>
  </Modal>
);

export default IntroModal;
