#!/bin/bash

# Excalibrr MCP Server - Management Script
# Easy server management commands

set -e

CONTAINER_NAME="excalibrr-mcp-server"
PORT="3000"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

show_help() {
    echo -e "${BLUE}Excalibrr MCP Server - Management${NC}"
    echo -e "${BLUE}=================================${NC}"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo -e "  ${YELLOW}status${NC}     Show server status"
    echo -e "  ${YELLOW}start${NC}      Start the server"
    echo -e "  ${YELLOW}stop${NC}       Stop the server"  
    echo -e "  ${YELLOW}restart${NC}    Restart the server"
    echo -e "  ${YELLOW}logs${NC}       Show server logs"
    echo -e "  ${YELLOW}health${NC}     Check server health"
    echo -e "  ${YELLOW}remove${NC}     Stop and remove the server"
    echo -e "  ${YELLOW}rebuild${NC}    Rebuild and restart the server"
    echo -e "  ${YELLOW}shell${NC}      Open shell in running container"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 logs"
    echo "  $0 health"
}

check_container_exists() {
    if ! docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo -e "${RED}❌ Container '${CONTAINER_NAME}' not found${NC}"
        echo -e "${YELLOW}💡 Run './start-excalibrr.sh' to create and start the server${NC}"
        exit 1
    fi
}

show_status() {
    echo -e "${BLUE}📊 Server Status${NC}"
    echo ""
    
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        # Container exists
        if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
            echo -e "🟢 Status: ${GREEN}Running${NC}"
        else
            echo -e "🔴 Status: ${RED}Stopped${NC}"
        fi
        
        # Show container details
        echo -e "🐳 Container: ${CONTAINER_NAME}"
        echo -e "🌐 Port: ${PORT}"
        echo -e "📊 Details:"
        docker ps -a --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"
        
        # Health check if running
        if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
            echo ""
            echo -e "${BLUE}🏥 Health Check:${NC}"
            if curl -s http://localhost:${PORT}/health > /dev/null 2>&1; then
                echo -e "✅ Server is ${GREEN}healthy${NC}"
                echo -e "🔗 Access at: http://localhost:${PORT}"
            else
                echo -e "❌ Server is ${RED}not responding${NC}"
            fi
        fi
    else
        echo -e "⚪ Status: ${YELLOW}Not created${NC}"
        echo -e "${YELLOW}💡 Run './start-excalibrr.sh' to create and start the server${NC}"
    fi
}

start_server() {
    check_container_exists
    
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo -e "${GREEN}✅ Server is already running${NC}"
        return
    fi
    
    echo -e "${BLUE}🚀 Starting server...${NC}"
    docker start ${CONTAINER_NAME}
    
    echo -e "${BLUE}⏳ Waiting for server to be ready...${NC}"
    sleep 3
    
    for i in {1..10}; do
        if curl -s http://localhost:${PORT}/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Server started successfully!${NC}"
            echo -e "🔗 Access at: http://localhost:${PORT}"
            return
        fi
        sleep 2
    done
    
    echo -e "${YELLOW}⚠️  Server started but may not be ready yet${NC}"
    echo -e "💡 Check logs with: $0 logs"
}

stop_server() {
    check_container_exists
    
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo -e "${YELLOW}⚠️  Server is not running${NC}"
        return
    fi
    
    echo -e "${BLUE}⏹️  Stopping server...${NC}"
    docker stop ${CONTAINER_NAME}
    echo -e "${GREEN}✅ Server stopped${NC}"
}

restart_server() {
    echo -e "${BLUE}🔄 Restarting server...${NC}"
    stop_server
    sleep 2
    start_server
}

show_logs() {
    check_container_exists
    echo -e "${BLUE}📋 Server Logs (press Ctrl+C to exit)${NC}"
    echo ""
    docker logs -f ${CONTAINER_NAME}
}

check_health() {
    check_container_exists
    
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo -e "${RED}❌ Server is not running${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}🏥 Health Check${NC}"
    echo ""
    
    if curl -s http://localhost:${PORT}/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server is healthy${NC}"
        echo ""
        echo -e "${BLUE}Response:${NC}"
        curl -s http://localhost:${PORT}/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:${PORT}/health
    else
        echo -e "${RED}❌ Server is not responding${NC}"
        echo -e "${YELLOW}💡 Check logs with: $0 logs${NC}"
        exit 1
    fi
}

remove_server() {
    check_container_exists
    
    echo -e "${YELLOW}⚠️  This will stop and remove the server container${NC}"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🗑️  Removing server...${NC}"
        docker stop ${CONTAINER_NAME} 2>/dev/null || true
        docker rm ${CONTAINER_NAME}
        echo -e "${GREEN}✅ Server removed${NC}"
        echo -e "${YELLOW}💡 Run './start-excalibrr.sh' to recreate${NC}"
    else
        echo -e "${BLUE}Operation cancelled${NC}"
    fi
}

rebuild_server() {
    echo -e "${BLUE}🔨 Rebuilding server...${NC}"
    
    # Stop and remove if exists
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        docker stop ${CONTAINER_NAME} 2>/dev/null || true
        docker rm ${CONTAINER_NAME} 2>/dev/null || true
    fi
    
    # Rebuild
    ./build-docker.sh
    
    # Start
    ./start-excalibrr.sh
}

open_shell() {
    check_container_exists
    
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo -e "${RED}❌ Server is not running${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}🐚 Opening shell in container...${NC}"
    docker exec -it ${CONTAINER_NAME} /bin/sh
}

# Main command handling
case "${1:-help}" in
    "status")
        show_status
        ;;
    "start")
        start_server
        ;;
    "stop")
        stop_server
        ;;
    "restart")
        restart_server
        ;;
    "logs")
        show_logs
        ;;
    "health")
        check_health
        ;;
    "remove")
        remove_server
        ;;
    "rebuild")
        rebuild_server
        ;;
    "shell")
        open_shell
        ;;
    "help"|*)
        show_help
        ;;
esac