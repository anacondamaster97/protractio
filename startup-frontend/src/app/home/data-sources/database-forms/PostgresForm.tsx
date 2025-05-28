import { Input } from "@/components/ui/input";

interface DatabaseFormProps {
  credentials: any;
  onChange: (field: string, value: string) => void;
}

export function PostgresForm({ credentials, onChange }: DatabaseFormProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Host
        </label>
        <Input
          placeholder="e.g., your-db-instance.rds.amazonaws.com"
          value={credentials.host}
          onChange={(e) => onChange('host', e.target.value)}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Port
        </label>
        <Input
          placeholder="5432"
          value={credentials.port}
          onChange={(e) => onChange('port', e.target.value)}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Database Name
        </label>
        <Input
          placeholder="Enter database name"
          value={credentials.database}
          onChange={(e) => onChange('database', e.target.value)}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Username
        </label>
        <Input
          placeholder="Enter username"
          value={credentials.user}
          onChange={(e) => onChange('user', e.target.value)}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Password
        </label>
        <Input
          type="password"
          placeholder="Enter password"
          value={credentials.password}
          onChange={(e) => onChange('password', e.target.value)}
          className="h-12"
        />
      </div>
    </div>
  );
} 