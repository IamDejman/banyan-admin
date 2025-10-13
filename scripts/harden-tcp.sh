#!/bin/bash

# TCP Security Hardening Script
# Disables TCP timestamps and implements other TCP security measures

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔒 TCP Security Hardening${NC}"
echo "========================="

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ This script must be run as root${NC}"
   echo "Please run: sudo $0"
   exit 1
fi

# Function to backup sysctl configuration
backup_sysctl() {
    echo -e "${YELLOW}📁 Creating backup of sysctl configuration...${NC}"
    
    if [ -f /etc/sysctl.conf ]; then
        cp /etc/sysctl.conf /etc/sysctl.conf.backup.$(date +%Y%m%d-%H%M%S)
        echo -e "${GREEN}✅ Backup created: /etc/sysctl.conf.backup.$(date +%Y%m%d-%H%M%S)${NC}"
    fi
    
    if [ -f /etc/sysctl.d/99-sysctl.conf ]; then
        cp /etc/sysctl.d/99-sysctl.conf /etc/sysctl.d/99-sysctl.conf.backup.$(date +%Y%m%d-%H%M%S)
        echo -e "${GREEN}✅ Backup created: /etc/sysctl.d/99-sysctl.conf.backup.$(date +%Y%m%d-%H%M%S)${NC}"
    fi
}

# Function to disable TCP timestamps
disable_tcp_timestamps() {
    echo -e "${YELLOW}🕐 Disabling TCP timestamps...${NC}"
    
    # Create sysctl configuration file for TCP hardening
    cat > /etc/sysctl.d/99-tcp-security.conf << 'EOF'
# TCP Security Hardening Configuration
# Disable TCP timestamps to prevent uptime disclosure

# Disable TCP timestamps (RFC1323/RFC7323)
net.ipv4.tcp_timestamps = 0

# Additional TCP security measures
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_intvl = 60
net.ipv4.tcp_keepalive_probes = 3

# Disable IP forwarding
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

# Disable source routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0

# Disable ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0

# Disable send redirects
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0

# Log suspicious packets
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# Ignore ICMP ping requests
net.ipv4.icmp_echo_ignore_all = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Disable IPv6 if not needed
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1

# TCP window scaling (disable if causing issues)
# net.ipv4.tcp_window_scaling = 0

# TCP selective acknowledgments (disable if causing issues)
# net.ipv4.tcp_sack = 0
EOF

    echo -e "${GREEN}✅ TCP security configuration created${NC}"
}

# Function to apply sysctl settings
apply_sysctl() {
    echo -e "${YELLOW}⚙️  Applying sysctl settings...${NC}"
    
    # Load the new configuration
    sysctl -p /etc/sysctl.d/99-tcp-security.conf
    
    # Reload all sysctl configurations
    sysctl --system
    
    echo -e "${GREEN}✅ Sysctl settings applied successfully${NC}"
}

# Function to verify TCP timestamps are disabled
verify_tcp_timestamps() {
    echo -e "${YELLOW}🔍 Verifying TCP timestamps configuration...${NC}"
    
    current_value=$(sysctl net.ipv4.tcp_timestamps | cut -d= -f2 | xargs)
    
    if [ "$current_value" = "0" ]; then
        echo -e "${GREEN}✅ TCP timestamps are DISABLED${NC}"
    else
        echo -e "${RED}❌ TCP timestamps are still ENABLED (value: $current_value)${NC}"
        echo -e "${YELLOW}⚠️  You may need to reboot for changes to take effect${NC}"
    fi
}

# Function to show current TCP configuration
show_tcp_config() {
    echo -e "${BLUE}📊 Current TCP Configuration:${NC}"
    echo "================================"
    
    echo -e "${BLUE}TCP Timestamps:${NC}"
    sysctl net.ipv4.tcp_timestamps
    
    echo -e "${BLUE}TCP Syncookies:${NC}"
    sysctl net.ipv4.tcp_syncookies
    
    echo -e "${BLUE}TCP Window Scaling:${NC}"
    sysctl net.ipv4.tcp_window_scaling
    
    echo -e "${BLUE}TCP SACK:${NC}"
    sysctl net.ipv4.tcp_sack
    
    echo -e "${BLUE}IP Forwarding:${NC}"
    sysctl net.ipv4.ip_forward
}

# Function to create systemd service for persistent configuration
create_persistent_service() {
    echo -e "${YELLOW}🔧 Creating persistent configuration service...${NC}"
    
    cat > /etc/systemd/system/tcp-security.service << 'EOF'
[Unit]
Description=Apply TCP Security Hardening
After=network.target

[Service]
Type=oneshot
ExecStart=/sbin/sysctl -p /etc/sysctl.d/99-tcp-security.conf
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable tcp-security.service
    
    echo -e "${GREEN}✅ Persistent TCP security service created and enabled${NC}"
}

# Function to generate hardening report
generate_hardening_report() {
    echo -e "${YELLOW}📋 Generating TCP hardening report...${NC}"
    
    REPORT_FILE="tcp-hardening-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "TCP Security Hardening Report - $(date)"
        echo "====================================="
        echo ""
        echo "Configuration Applied:"
        echo "====================="
        echo ""
        echo "TCP Timestamps: DISABLED"
        echo "TCP Syncookies: ENABLED"
        echo "IP Forwarding: DISABLED"
        echo "Source Routing: DISABLED"
        echo "ICMP Redirects: DISABLED"
        echo "ICMP Ping: DISABLED"
        echo "IPv6: DISABLED (if not needed)"
        echo ""
        echo "Current Values:"
        echo "==============="
        sysctl net.ipv4.tcp_timestamps
        sysctl net.ipv4.tcp_syncookies
        sysctl net.ipv4.ip_forward
        sysctl net.ipv4.icmp_echo_ignore_all
        echo ""
        echo "Files Created:"
        echo "=============="
        echo "- /etc/sysctl.d/99-tcp-security.conf"
        echo "- /etc/systemd/system/tcp-security.service"
        echo ""
        echo "Recommendations:"
        echo "==============="
        echo "1. Reboot the system to ensure all changes take effect"
        echo "2. Monitor system performance after applying changes"
        echo "3. Test network connectivity and application functionality"
        echo "4. Consider enabling TCP window scaling if performance is affected"
        echo "5. Re-enable IPv6 if needed for your application"
    } > $REPORT_FILE
    
    echo -e "${GREEN}📄 TCP hardening report saved to: $REPORT_FILE${NC}"
}

# Main menu
echo "TCP Security Hardening Options:"
echo "1) Apply full TCP hardening"
echo "2) Disable TCP timestamps only"
echo "3) Show current configuration"
echo "4) Verify TCP timestamps status"
echo "5) Generate hardening report"
echo "6) Exit"

read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo -e "${BLUE}🚀 Applying full TCP security hardening...${NC}"
        backup_sysctl
        disable_tcp_timestamps
        apply_sysctl
        create_persistent_service
        verify_tcp_timestamps
        generate_hardening_report
        ;;
    2)
        echo -e "${BLUE}🚀 Disabling TCP timestamps only...${NC}"
        backup_sysctl
        echo "net.ipv4.tcp_timestamps = 0" >> /etc/sysctl.conf
        apply_sysctl
        verify_tcp_timestamps
        ;;
    3)
        show_tcp_config
        ;;
    4)
        verify_tcp_timestamps
        ;;
    5)
        generate_hardening_report
        ;;
    6)
        echo -e "${GREEN}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 TCP security hardening complete!${NC}"
echo -e "${YELLOW}📝 Important Notes:${NC}"
echo "- TCP timestamps are now disabled"
echo "- Additional TCP security measures have been applied"
echo "- Configuration is persistent across reboots"
echo "- Monitor system performance after changes"
echo ""
echo -e "${BLUE}🔍 To verify changes:${NC}"
echo "sysctl net.ipv4.tcp_timestamps"
echo ""
echo -e "${BLUE}🔄 To revert changes:${NC}"
echo "sudo cp /etc/sysctl.conf.backup.* /etc/sysctl.conf"
echo "sudo sysctl -p"
