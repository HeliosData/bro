# Generated by binpac_quickstart

# Analyzer for mongodb parse
#  - mongodb-protocol.pac: describes the mongodb protocol messages
#  - mongodb-analyzer.pac: describes the mongodb analyzer code


#
#THESE TWO FILES NEED TO BE COPIED FROM THE BRO SOURCE DIRECTORY TO OUR WORKING DIRECTORY TO MAKE IT WORK:
#

%include binpac.pac
%include bro.pac

###
#THESE LINES ARE NECESSARY BECAUSE LATER A events.bif.h file IS GENERATED, BUT ITS NOT INCLUDED 
#ANYWHERE. WE MAKE THE INCLUDE HERE THAT WILL BE ADDED LATER IN THE .cc FILE
###

%extern{
	#include "events.bif.h"
%}


###
#HERE WE DECLARE THE ANALYZER. IT IS ALWAYS MORE OR LESS THE SAME, IT HAS A CONNECTION AND TWO 
#FLOWS. OFICCIALLY A FLOW IS A SEQUENCE OF MESSAGES AND THE STATE BETWEEN MESSAGES
###

analyzer MONGODB withcontext {
	connection: MONGODB_Conn;
	flow:       MONGODB_Flow;
};

# Our connection consists of two flows, one in each direction.
connection MONGODB_Conn(bro_analyzer: BroAnalyzer) {
	upflow   = MONGODB_Flow(true);
	downflow = MONGODB_Flow(false);
};

##
#As We can see: after declear what a connection and a flow is, we include the mongodb-protocol.pcac
#and the processing continues with it
##

%include mongodb-protocol.pac

##
#A FLOW COMPONENTS ARE PDUs. IN MyProt-protocol.pac WE HAVE PREVIOUSLY DEFINED WHAT A MyProt PDU IS.
##
flow MONGODB_Flow(is_orig: bool) {

	# ## TODO: Determine if you want flowunit or datagram parsing:

	# Using flowunit will cause the anlayzer to buffer incremental input.
	# This is needed for &oneline and &length. If you don't need this, you'll
	# get better performance with datagram.

	flowunit = MONGODB_PDU(is_orig) withcontext(connection, this);
    #datagram = MONGODB_PDU(is_orig) withcontext(connection, this);

};

###
# finally the analyzer is included to generate the event
###

%include mongodb-analyzer.pac

#mongodb-procotol is defining the protocol and mongodb-analyzer.pac is defining the function to parse the flow and generate the events