"use client";

interface QualTableData {
  headers: string[];
  rows: string[][];
}

interface QualTableProps {
  data: QualTableData;
  title?: string;
}

export function QualTable({ data, title = "Response Details" }: QualTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {title && (
        <div className="px-5 py-3 border-b border-border">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              {data.headers.map((header, i) => (
                <th
                  key={i}
                  className="text-left px-4 py-3 font-medium text-muted-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-t border-border hover:bg-muted/30 transition-colors"
              >
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-3 text-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.rows.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">
            No responses yet.
          </p>
        )}
      </div>
    </div>
  );
}
