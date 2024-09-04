/* eslint-disable max-len */
export default `<?xml version="1.0" encoding="utf-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:hl7="urn:hl7-org:v3">
    <SOAP-ENV:Header>
        <wsa:MessageID>uuid:{{messageGUID}}</wsa:MessageID>
        <wsa:Action>urn:nhs:names:services:mmquery/QURX_IN000005UK98</wsa:Action>
        <wsa:To>https://pds-sync.national.ncrs.nhs.uk/syncservice-pds/pds</wsa:To>
        <wsa:From>
            <wsa:Address></wsa:Address>
        </wsa:From>
        <hl7:communicationFunctionRcv>
            <hl7:device>
                <hl7:id root="1.2.826.0.1285.0.2.0.107" extension="{{toASID}}"/>
            </hl7:device>
        </hl7:communicationFunctionRcv>
        <hl7:communicationFunctionSnd>
            <hl7:device>
                <hl7:id root="1.2.826.0.1285.0.2.0.107" extension="{{fromASID}}"/>
            </hl7:device>
        </hl7:communicationFunctionSnd>
        <wsa:ReplyTo>
            <wsa:Address></wsa:Address>
        </wsa:ReplyTo>
    </SOAP-ENV:Header>
    <SOAP-ENV:Body>
        <QURX_IN000005UK98 xmlns="urn:hl7-org:v3">
            <id root="{{messageGUID}}"/>
            <creationTime value="{{creationTime}}"/>
            <versionCode code="V3NPfIT3.0"/>
            <interactionId root="2.16.840.1.113883.2.1.3.2.4.12" extension="QURX_IN000005UK98"/>
            <processingCode code="P"/>
            <processingModeCode code="T"/>
            <acceptAckCode code="NE"/>
            <communicationFunctionRcv>
                <device classCode="DEV" determinerCode="INSTANCE">
                    <id root="1.2.826.0.1285.0.2.0.107" extension="{{toASID}}"/>
                </device>
            </communicationFunctionRcv>
            <communicationFunctionSnd>
                <device classCode="DEV" determinerCode="INSTANCE">
                    <id root="1.2.826.0.1285.0.2.0.107" extension="{{fromASID}}"/>
                </device>
            </communicationFunctionSnd>
            <ControlActEvent xmlns="urn:hl7-org:v3" classCode="CACT" moodCode="EVN">
                <author typeCode="AUT">
                            <AgentPersonSDS classCode="AGNT">
                                <id root="1.2.826.0.1285.0.2.0.67" extension="{{agentPersonSDSRoleProfileId}}"/>
                                <agentPersonSDS classCode="PSN" determinerCode="INSTANCE">
                                    <id root="1.2.826.0.1285.0.2.0.65" extension="{{agentPersonSDSId}}"/>
                                </agentPersonSDS>
                                <part typeCode="PART">
                                    <partSDSRole classCode="ROL">
                                            <id root="1.2.826.0.1285.0.2.1.104" extension="{{agentPersonJobRoleCode}}"/>
                                    </partSDSRole>
                                </part>
                            </AgentPersonSDS>
                        </author>
                <author1 typeCode="AUT">
                    <AgentSystemSDS classCode="AGNT">
                        <agentSystemSDS classCode="DEV" determinerCode="INSTANCE">
                            <id root="1.2.826.0.1285.0.2.0.107" extension="{{fromASID}}"/>
                        </agentSystemSDS>
                    </AgentSystemSDS>
                </author1>
                <query xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:hl7-org:v3 ../Schemas/QURX_MT000005UK01.xsd">

                    <organization.id>
                        <value root="1.2.826.0.1285.0.1.10" extension="{{organizationId}}"/>
                        <semanticsText>Organization.id</semanticsText>
                    </organization.id>

                    <prescription.id>
                        <value root="{{prescriptionId}}"/>
                        <semanticsText>Prescription.id</semanticsText>
                    </prescription.id>

                    <prescription.repeatNumber {{#repeatNumber}} value="{{repeatNumber}}" {{/repeatNumber}} />

                    <requesterOrganizationType>
                        <value code="999" codeSystem="2.16.840.1.113883.2.1.3.2.4.17.128"/>
                        <semanticsText>RequesterOrganizationType</semanticsText>
                    </requesterOrganizationType>
                </query>
            </ControlActEvent>
        </QURX_IN000005UK98>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`
