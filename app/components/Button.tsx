interface ButtonProps {
  text: string;
  classname?: string;
  onClick?: () => void;
}

export default function Button({
  text,
  onClick = () => {},
  classname = "",
}: ButtonProps) {
  return (
    <button
      className={`bg-neutral-800/65 transition-all px-5 border border-neutral-700/50 rounded cursor-pointer hover:bg-neutral-800 ${classname}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
