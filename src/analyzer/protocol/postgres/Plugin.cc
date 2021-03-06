// Generated by binpac_quickstart

#include "plugin/Plugin.h"

#include "POSTGRES.h"

namespace plugin {
namespace Bro_POSTGRES {

class Plugin : public plugin::Plugin {
public:
	plugin::Configuration Configure()
		{
		AddComponent(new ::analyzer::Component("POSTGRES",
		             ::analyzer::Postgres::POSTGRES_Analyzer::InstantiateAnalyzer));

		plugin::Configuration config;
		config.name = "Bro::POSTGRES";
		config.description = "Postgres Protocol analyzer";
		return config;
		}
} plugin;

}
}