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
      className={`bg-neutral-900 border border-neutral-800 rounded cursor-pointer hover:bg-neutral-800 ${classname}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
