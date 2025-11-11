"""
SMS Webhook API for ElevenLabs Server Tools
Allows voice agent to send text messages during calls
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from app.services.sms_service import sms_service

router = APIRouter(prefix="/api/sms", tags=["SMS"])


class SendSMSRequest(BaseModel):
    """Request model for sending SMS"""
    phone_number: str = Field(..., description="Recipient phone number")
    message: str = Field(..., description="Message to send")
    patient_name: Optional[str] = Field(None, description="Patient name for personalization")


class SendCopayCardRequest(BaseModel):
    """Request model for sending copay card"""
    phone_number: str = Field(..., description="Recipient phone number")
    patient_name: str = Field(..., description="Patient name")
    copay_url: str = Field(..., description="URL to copay assistance card")


class SendPriorAuthUpdateRequest(BaseModel):
    """Request model for prior auth update"""
    phone_number: str = Field(..., description="Recipient phone number")
    patient_name: str = Field(..., description="Patient name")
    status: str = Field(..., description="Prior auth status: approved, denied, or pending")


@router.post("/send")
async def send_sms(request: SendSMSRequest):
    """
    Send a generic SMS message
    This endpoint is called by ElevenLabs Server Tool
    """
    try:
        result = sms_service.send_sms(
            to_number=request.phone_number,
            message=request.message
        )

        if result['success']:
            return {
                "success": True,
                "message": f"SMS sent successfully to {request.phone_number}",
                "message_sid": result['message_sid']
            }
        else:
            raise HTTPException(status_code=500, detail=result['error'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/send-copay-card")
async def send_copay_card(request: SendCopayCardRequest):
    """
    Send copay assistance card to patient
    This endpoint is called by ElevenLabs Server Tool
    """
    try:
        result = sms_service.send_copay_card(
            to_number=request.phone_number,
            patient_name=request.patient_name,
            copay_url=request.copay_url
        )

        if result['success']:
            return {
                "success": True,
                "message": f"Copay card sent to {request.patient_name} at {request.phone_number}",
                "message_sid": result['message_sid']
            }
        else:
            raise HTTPException(status_code=500, detail=result['error'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/send-prescription-reminder")
async def send_prescription_reminder(
    phone_number: str,
    patient_name: str,
    medication: str
):
    """
    Send prescription refill reminder
    This endpoint is called by ElevenLabs Server Tool
    """
    try:
        result = sms_service.send_prescription_reminder(
            to_number=phone_number,
            patient_name=patient_name,
            medication=medication
        )

        if result['success']:
            return {
                "success": True,
                "message": f"Prescription reminder sent to {patient_name}",
                "message_sid": result['message_sid']
            }
        else:
            raise HTTPException(status_code=500, detail=result['error'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/send-prior-auth-update")
async def send_prior_auth_update(request: SendPriorAuthUpdateRequest):
    """
    Send prior authorization status update
    This endpoint is called by ElevenLabs Server Tool
    """
    try:
        result = sms_service.send_prior_auth_update(
            to_number=request.phone_number,
            patient_name=request.patient_name,
            status=request.status
        )

        if result['success']:
            return {
                "success": True,
                "message": f"Prior auth update sent to {request.patient_name}",
                "message_sid": result['message_sid']
            }
        else:
            raise HTTPException(status_code=500, detail=result['error'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/send-appointment-confirmation")
async def send_appointment_confirmation(
    phone_number: str,
    patient_name: str,
    appointment_date: str,
    appointment_time: str
):
    """
    Send appointment confirmation
    This endpoint is called by ElevenLabs Server Tool
    """
    try:
        result = sms_service.send_appointment_confirmation(
            to_number=phone_number,
            patient_name=patient_name,
            appointment_date=appointment_date,
            appointment_time=appointment_time
        )

        if result['success']:
            return {
                "success": True,
                "message": f"Appointment confirmation sent to {patient_name}",
                "message_sid": result['message_sid']
            }
        else:
            raise HTTPException(status_code=500, detail=result['error'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
