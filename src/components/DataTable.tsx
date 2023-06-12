import { ProcedureUseQuery } from "@trpc/react-query/dist/createTRPCReact";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";
import { AnyProcedure } from "@trpc/server";
import { useEffect, useState } from "react";

interface ColumnDefinition {
  key: string;
  title: string;
}

function getColumns(data: unknown[]) {
  const columns: {
    key: string;
    title: string;
  }[] = [];
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      columns.push({
        key,
        title: key,
      });
    }
  }
  return columns;
}

const DataTable = (props: {
  queryResult: UseTRPCQueryResult<unknown[], unknown>;
}) => {
  const [columns, setColumns] = useState<ColumnDefinition[]>([]);

  useEffect(() => {
    if (props.queryResult.data) {
      setColumns(getColumns(props.queryResult.data));
    }
  }, [props.queryResult.data]);

  if (props.queryResult.data) {

    const columns = getColumns(props.queryResult.data);
  }
  props.queryResult.isLoading;
};
