
type SelectProps = {
  label: string;
  options: {
    id: string | number;
    label: string;
  }[];
}

export default function Select(props) {
  const { label, options } = props;

  return (
    <div>
      <h4>{label}</h4>
      <select>
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}