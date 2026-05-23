interface Props {
  message: string
}

export default function ErrorMessage({ message }: Props) {
  return <div style={{ color: 'red', marginBottom: '1rem', wordBreak: 'keep-all' }}>{message}</div>
}
