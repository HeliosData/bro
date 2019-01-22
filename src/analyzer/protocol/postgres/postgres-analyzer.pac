# Generated by binpac_quickstart

refine flow POSTGRES_Flow += {

	function proc_postgres_PDU(msg: POSTGRES_PDU): bool
		%{
		BifEvent::generate_postgres_event(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn());
		return true;
		%}

	function proc_postgres_message(msg: PostgresMessage): bool
		%{
		return true;
		%}

	function proc_postgres_command_query(msg: CommandQuery): bool
		%{
	    StringVal *query;
		string q = std_str(msg->query());
		query = new StringVal(q);
		printf("QUERY %s\n", query->Bytes());
		fflush(stdout);
		BifEvent::generate_postgres_query_event(connection()->bro_analyzer(),
				connection()->bro_analyzer()->Conn(), query);

		return true;
		%}

	function proc_postgres_command_generic(msg: CommandGeneric): bool
		%{
		return true;
		%}


	function proc_postgres_client_message(m: PostgresClientMessage): bool
    	%{
        return true;
    	%}
};

refine typeattr POSTGRES_PDU += &let {
	proc: bool = $context.flow.proc_postgres_PDU(this);
};

refine typeattr PostgresMessage += &let {
	proc: bool = $context.flow.proc_postgres_message(this);
};

refine typeattr PostgresClientMessage += &let {
    proc = $context.flow.proc_postgres_client_message(this);
};

refine typeattr CommandQuery += &let {
	proc: bool = $context.flow.proc_postgres_command_query(this);
};

refine typeattr CommandGeneric += &let {
	proc: bool = $context.flow.proc_postgres_command_generic(this);
};


