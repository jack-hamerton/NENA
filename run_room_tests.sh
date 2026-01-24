#!/bin/bash

# Room Page Backend - Test Execution Script
# This script runs all Room Page backend tests and generates a report

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/backend"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     ROOM PAGE - BACKEND COMPREHENSIVE TEST SUITE           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Python is available
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo -e "${RED}❌ Python not found. Please install Python 3.8+${NC}"
    exit 1
fi

PYTHON=$(command -v python3 || command -v python)
echo -e "${GREEN}✓${NC} Python found: $PYTHON"
echo ""

# Check pytest is available
if ! $PYTHON -m pytest --version &> /dev/null; then
    echo -e "${RED}❌ pytest not installed${NC}"
    echo "Run: pip install pytest"
    exit 1
fi

PYTEST_VERSION=$($PYTHON -m pytest --version | awk '{print $2}')
echo -e "${GREEN}✓${NC} pytest version: $PYTEST_VERSION"
echo ""

# Run tests with different options based on argument
echo "Running Room Comprehensive Tests..."
echo "─────────────────────────────────────────────────────────────"
echo ""

if [ "$1" == "-v" ] || [ "$1" == "--verbose" ]; then
    echo "Running in VERBOSE mode..."
    $PYTHON -m pytest tests/test_room_comprehensive.py -v --tb=short
elif [ "$1" == "-q" ] || [ "$1" == "--quick" ]; then
    echo "Running QUICK mode (no output)..."
    $PYTHON -m pytest tests/test_room_comprehensive.py -q
elif [ "$1" == "--coverage" ]; then
    echo "Running with COVERAGE report..."
    $PYTHON -m pytest tests/test_room_comprehensive.py -v --cov=app.models --cov=app.crud --cov-report=html
    echo ""
    echo "Coverage report: htmlcov/index.html"
elif [ "$1" == "--class" ]; then
    if [ -z "$2" ]; then
        echo "Usage: $0 --class <TestClassName>"
        echo ""
        echo "Available test classes:"
        echo "  - TestRoomHealth"
        echo "  - TestRoomCreation"
        echo "  - TestRoomParticipants"
        echo "  - TestRoomMessaging"
        echo "  - TestRoomDataIntegrity"
        echo "  - TestRoomWebRTC"
        echo "  - TestRoomPolls"
        echo "  - TestRoomIntegration"
        echo "  - TestRoomErrorHandling"
        echo "  - TestRoomPerformance"
        exit 1
    fi
    echo "Running $2 tests..."
    $PYTHON -m pytest tests/test_room_comprehensive.py::$2 -v --tb=short
elif [ "$1" == "--test" ]; then
    if [ -z "$2" ]; then
        echo "Usage: $0 --test <TestName>"
        exit 1
    fi
    echo "Running test: $2"
    $PYTHON -m pytest tests/test_room_comprehensive.py -k "$2" -v --tb=short
elif [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  (no option)    Run all tests with standard output"
    echo "  -v, --verbose  Run with verbose output"
    echo "  -q, --quick    Run silently, only show summary"
    echo "  --coverage     Generate coverage report"
    echo "  --class NAME   Run specific test class"
    echo "  --test NAME    Run specific test by name"
    echo "  -h, --help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./run_room_tests.sh                              # Run all tests"
    echo "  ./run_room_tests.sh -v                           # Verbose output"
    echo "  ./run_room_tests.sh --class TestRoomMessaging   # Run TestRoomMessaging"
    echo "  ./run_room_tests.sh --test test_send_message_to_room"
    exit 0
else
    # Standard run
    $PYTHON -m pytest tests/test_room_comprehensive.py -v --tb=line
fi

TEST_EXIT_CODE=$?

echo ""
echo "─────────────────────────────────────────────────────────────"

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         ✓ ALL ROOM TESTS PASSED - READY TO DEPLOY          ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║    ✗ SOME TESTS FAILED - DEPLOYMENT BLOCKED              ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Run with -v flag for detailed output:${NC}"
    echo "  ./run_room_tests.sh -v"
    echo ""
fi

exit $TEST_EXIT_CODE
