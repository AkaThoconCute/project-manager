import { Helmet as ReactHelmet } from "react-helmet-async";

interface HelmetProps {
  title: string;
}

const Helmet = ({ title }: HelmetProps) => (
  <ReactHelmet title={`${title} | Project-Manager`} />
);

export default Helmet;
