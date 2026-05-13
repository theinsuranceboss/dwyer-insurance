"use client";

import {
  Car, Home, Heart, Building2, Landmark, Bike, Ship, TreePine,
  Umbrella, Fingerprint, Wrench, Shield, Award, Phone, Mail,
  MapPin, Clock, Star, Globe, Users, Handshake, CheckCircle2,
  ArrowRight, MessageCircle, ShieldCheck, FileText, Sparkles,
} from "lucide-react";

export default function DynamicIcon({
  name,
  size,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const props = { size, className, style };
  switch (name) {
    case "Car": return <Car {...props} />;
    case "Home": return <Home {...props} />;
    case "Heart": return <Heart {...props} />;
    case "Building2": return <Building2 {...props} />;
    case "Landmark": return <Landmark {...props} />;
    case "Bike": return <Bike {...props} />;
    case "Ship": return <Ship {...props} />;
    case "TreePine": return <TreePine {...props} />;
    case "Umbrella": return <Umbrella {...props} />;
    case "Fingerprint": return <Fingerprint {...props} />;
    case "Wrench": return <Wrench {...props} />;
    case "Briefcase": return <Building2 {...props} />;
    case "Shield": return <Shield {...props} />;
    case "Award": return <Award {...props} />;
    case "Phone": return <Phone {...props} />;
    case "Mail": return <Mail {...props} />;
    case "MapPin": return <MapPin {...props} />;
    case "Clock": return <Clock {...props} />;
    case "Star": return <Star {...props} />;
    case "Globe": return <Globe {...props} />;
    case "Users": return <Users {...props} />;
    case "Handshake": return <Handshake {...props} />;
    case "CheckCircle2": return <CheckCircle2 {...props} />;
    case "ArrowRight": return <ArrowRight {...props} />;
    case "MessageCircle": return <MessageCircle {...props} />;
    case "ShieldCheck": return <ShieldCheck {...props} />;
    case "FileText": return <FileText {...props} />;
    case "Sparkles": return <Sparkles {...props} />;
    default: return <Shield {...props} />;
  }
}
