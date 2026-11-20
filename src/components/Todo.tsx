import { isTodo } from '../content';
import s from './Todo.module.css';

/** Renders text, or nothing if it is a TODO (a dashed badge in dev, so it is easy to spot). */
export function Txt({ v, fallback = null }: { v: string; fallback?: React.ReactNode }) {
  if (!isTodo(v)) return <>{v}</>;
  if (import.meta.env.DEV) return <span className={s.todo} title={v}>{v}</span>;
  return <>{fallback}</>;
}
