#!/bin/bash

# SSL Certificate Setup Script for Banyan Admin
# This script helps set up SSL certificates securely

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔐 SSL Certificate Setup for Banyan Admin${NC}"
echo "================================================"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   exit 1
fi

# Create SSL directory
mkdir -p ssl
cd ssl

echo -e "${YELLOW}📁 SSL directory created${NC}"

# Function to generate self-signed certificate (for development)
generate_self_signed() {
    echo -e "${YELLOW}🔧 Generating self-signed certificate for development...${NC}"
    
    # Generate private key
    openssl genrsa -out key.pem 4096
    
    # Generate certificate signing request
    openssl req -new -key key.pem -out cert.csr -subj "/C=NG/ST=Lagos/L=Lagos/O=Banyan Admin/OU=IT/CN=localhost"
    
    # Generate self-signed certificate
    openssl x509 -req -days 365 -in cert.csr -signkey key.pem -out cert.pem
    
    # Create chain file (same as cert for self-signed)
    cp cert.pem chain.pem
    
    # Clean up CSR
    rm cert.csr
    
    echo -e "${GREEN}✅ Self-signed certificate generated${NC}"
    echo -e "${YELLOW}⚠️  Remember: Self-signed certificates should only be used for development${NC}"
}

# Function to setup Let's Encrypt certificate (for production)
setup_letsencrypt() {
    echo -e "${YELLOW}🌐 Setting up Let's Encrypt certificate...${NC}"
    
    read -p "Enter your domain name: " DOMAIN
    read -p "Enter your email address: " EMAIL
    
    if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
        echo -e "${RED}❌ Domain and email are required${NC}"
        exit 1
    fi
    
    # Install certbot if not present
    if ! command -v certbot &> /dev/null; then
        echo -e "${YELLOW}📦 Installing certbot...${NC}"
        sudo apt-get update
        sudo apt-get install -y certbot
    fi
    
    # Generate certificate
    sudo certbot certonly --standalone -d $DOMAIN --email $EMAIL --agree-tos --non-interactive
    
    # Copy certificates to ssl directory
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./cert.pem
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./key.pem
    sudo cp /etc/letsencrypt/live/$DOMAIN/chain.pem ./chain.pem
    
    # Set proper permissions
    sudo chown $USER:$USER *.pem
    chmod 600 key.pem
    chmod 644 cert.pem chain.pem
    
    echo -e "${GREEN}✅ Let's Encrypt certificate installed${NC}"
    echo -e "${YELLOW}📅 Certificate expires in 90 days. Set up auto-renewal with cron${NC}"
}

# Function to setup auto-renewal
setup_auto_renewal() {
    echo -e "${YELLOW}🔄 Setting up auto-renewal...${NC}"
    
    # Create renewal script
    cat > renew-ssl.sh << 'EOF'
#!/bin/bash
certbot renew --quiet --post-hook "docker-compose restart nginx"
EOF
    
    chmod +x renew-ssl.sh
    
    # Add to crontab
    (crontab -l 2>/dev/null; echo "0 2 * * 1 /path/to/your/project/ssl/renew-ssl.sh") | crontab -
    
    echo -e "${GREEN}✅ Auto-renewal configured${NC}"
}

# Main menu
echo "Select certificate type:"
echo "1) Self-signed (Development)"
echo "2) Let's Encrypt (Production)"
echo "3) Setup auto-renewal"
echo "4) Exit"

read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        generate_self_signed
        ;;
    2)
        setup_letsencrypt
        ;;
    3)
        setup_auto_renewal
        ;;
    4)
        echo -e "${GREEN}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 SSL setup complete!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Update your domain in nginx.conf"
echo "2. Run: docker-compose up -d"
echo "3. Test your SSL: https://www.ssllabs.com/ssltest/"
