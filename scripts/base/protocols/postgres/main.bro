##! Implements base functionality for Postgres analysis.
##! Generates the Postgres.log file.

# Generated by binpac_quickstart

module Postgres;

export {
	redef enum Log::ID += { LOG };

	type Info: record {
		## Timestamp for when the event happened.
		ts:     time    &log;
		## Unique ID for the connection.
		uid:    string  &log;
		## The connection's 4-tuple of endpoint addresses/ports.
		id:     conn_id &log;
		## The request
		req:    string &log;

		# ## TODO: Add other fields here that you'd like to log.
	};

	## Event that can be handled to access the Postgres record as it is sent on
	## to the loggin framework.
	global log_postgres: event(rec: Info);
}

# TODO: The recommended method to do dynamic protocol detection
# (DPD) is with the signatures in dpd.sig. If you can't come up
# with any signatures, then you can do port-based detection by
# uncommenting the following and specifying the port(s):

const ports = { 5432/tcp };


redef likely_server_ports += { ports };

event bro_init() &priority=5
	{
	Log::create_stream(Postgres::LOG, [$columns=Info, $ev=log_postgres, $path="postgres"]);

	# TODO: If you're using port-based DPD, uncomment this.
	Analyzer::register_for_ports(Analyzer::ANALYZER_POSTGRES, ports);
	}

event postgres_event(c: connection)
	{
	local info: Info;
	info$ts  = network_time();
	info$uid = c$uid;
	info$id  = c$id;

	Log::write(Postgres::LOG, info);
	}

event postgres_query_event(c: connection, req: string)
    {
	local info: Info;
	info$ts  = network_time();
	info$uid = c$uid;
	info$id  = c$id;
	info$req = req;

	Log::write(Postgres::LOG, info);

	}
