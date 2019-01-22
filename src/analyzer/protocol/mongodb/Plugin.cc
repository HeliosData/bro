// Generated by binpac_quickstart

#include "plugin/Plugin.h"

#include "MONGODB.h"

namespace plugin {
namespace Bro_MONGODB {

class Plugin : public plugin::Plugin {
public:
	plugin::Configuration Configure()
		{
		AddComponent(new ::analyzer::Component("MONGODB",
		             ::analyzer::mongodb::MONGODB_Analyzer::InstantiateAnalyzer));

		plugin::Configuration config;
		config.name = "Bro::MONGODB";
		config.description = "mongodb parse analyzer";
		return config;
		}
} plugin;

}
}